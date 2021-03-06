'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  multerS3 = require('multer-s3'),
  aws = require('aws-sdk'),
  amazonS3URI = require('amazon-s3-uri'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User'),
  Recipe = mongoose.model('Recipe'),
  ObjectId = require('mongodb').ObjectID,
  validator = require('validator');

// ADD FIELDS
var whitelistedFields = ['firstName', 'lastName', 'email', 'username', 'weight', 'allergies', 'dietaryDefinitions', 'preferences', 'religiousRestrictions', 'recipes'];

var useS3Storage = config.uploads.storage === 's3' && config.aws.s3;
var s3;

if (useS3Storage) {
  aws.config.update({
    accessKeyId: config.aws.s3.accessKeyId,
    secretAccessKey: config.aws.s3.secretAccessKey
  });

  s3 = new aws.S3();
}

// List of Community Recipes
exports.listRecipes = function (req, res) {
  Recipe.find({}, function (err, recipes) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else res.send({'recipes': recipes});
  });
};

// List of My Recipes
exports.myRecipes = function (req, res) {
  var userDisplayName = req.user.displayName;

  Recipe.find({'ownedBy': userDisplayName}, function (err, recipes) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else res.send({'recipes': recipes});
  });
};

// Leaderboard List
exports.leaderboard = function (req, res) {
  var leaders = [];

  Recipe.find({}, function (err, recipes) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else {
      recipes.forEach( (recipe, i) => {
        var index = 0;

        if(leaders.length > 0) {
          leaders.forEach( (leader, j) => {
            if(leader.name == recipe.ownedBy) index = j;
            else index = -1;
          });
        }
        else {
          leaders.push({
            'name': recipe.ownedBy,
            'recipeCount': 1
          });
        }

        // If person is already in the array
        if(index !== -1) {
          leaders[index].recipeCount++;
        }
        else {
          leaders.push({
            'name': recipe.ownedBy,
            'recipeCount': 1
          });
        }
      });

      res.send({'leaders': leaders});
    }
  });
};

// Get details of recipe
exports.getDetails = function (req, res) {
  var recipeDetails = req.recipeDetails;

  res.send(recipeDetails);
}

// Get recipe by id as middleware
exports.recipeByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Recipe is invalid'
    });
  }

 Recipe.findById(id, function (err, recipe) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    req.recipeDetails = recipe;
    next();
  });
};

// Add recipe
exports.add = function (req, res) {
  var recipe = req.body;
  var newRecipe = new Recipe(recipe);

  newRecipe.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } 
    else res.json(newRecipe);
  });
};

// Update recipe
exports.updateRecipe = function(req, res) {
  var recipe = req.body;

  Recipe.findByIdAndUpdate(recipe._id, recipe, {new: true}, function (err, updatedRecipe) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else {
      res.json(updatedRecipe)
    }
  });
};

// Save new review for recipe
exports.reviewRecipe = function(req, res) {
  var rec = req.body;

  Recipe.findByIdAndUpdate(rec._id, {'review': rec.review}, function (err, recipe) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else res.send(recipe);
  });
}

// Get alternative search
exports.alternatives = function (req, res) {
  var searchFood = req.body.food;
  var cookingStyle = req.body.cookingStyle;
  var alternativeData = req.body.response;

  res.json(searchFood);
};

// Delete recipe
exports.deleteRecipe = function (req, res) {
  var recipe = req.body.recipe;

  Recipe.findByIdAndRemove(recipe._id, function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else res.send(recipe);
  });
};

/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;

  if (user) {
    // Update whitelisted fields only
    user = _.extend(user, _.pick(req.body, whitelistedFields));

    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var existingImageUrl;
  var multerConfig;


  if (useS3Storage) {
    multerConfig = {
      storage: multerS3({
        s3: s3,
        bucket: config.aws.s3.bucket,
        acl: 'public-read'
      })
    };
  } else {
    multerConfig = config.uploads.profile.image;
  }

  // Filtering to upload only images
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;

  var upload = multer(multerConfig).single('newProfilePicture');

  if (user) {
    existingImageUrl = user.profileImageURL;
    uploadImage()
      .then(updateUser)
      .then(deleteOldImage)
      .then(login)
      .then(function () {
        res.json(user);
      })
      .catch(function (err) {
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }

  function uploadImage() {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

  function updateUser() {
    return new Promise(function (resolve, reject) {
      user.profileImageURL = config.uploads.storage === 's3' && config.aws.s3 ?
        req.file.location :
        '/' + req.file.path;
      user.save(function (err, theuser) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  function deleteOldImage() {
    return new Promise(function (resolve, reject) {
      if (existingImageUrl !== User.schema.path('profileImageURL').defaultValue) {
        if (useS3Storage) {
          try {
            var { region, bucket, key } = amazonS3URI(existingImageUrl);
            var params = {
              Bucket: config.aws.s3.bucket,
              Key: key
            };

            s3.deleteObject(params, function (err) {
              if (err) {
                console.log('Error occurred while deleting old profile picture.');
                console.log('Check if you have sufficient permissions : ' + err);
              }

              resolve();
            });
          } catch (err) {
            console.warn(`${existingImageUrl} is not a valid S3 uri`);

            return resolve();
          }
        } else {
          fs.unlink(path.resolve('.' + existingImageUrl), function (unlinkError) {
            if (unlinkError) {

              // If file didn't exist, no need to reject promise
              if (unlinkError.code === 'ENOENT') {
                console.log('Removing profile image failed because file did not exist.');
                return resolve();
              }

              console.error(unlinkError);

              reject({
                message: 'Error occurred while deleting old profile picture'
              });
            } else {
              resolve();
            }
          });
        }
      } else {
        resolve();
      }
    });
  }

  function login() {
    return new Promise(function (resolve, reject) {
      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          resolve();
        }
      });
    });
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  // Sanitize the user - short term solution. Copied from core.server.controller.js
  // TODO create proper passport mock: See https://gist.github.com/mweibel/5219403
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),

     // Added fields
      weight: validator.escape(req.user.weight),
      allergies: validator.escape(req.user.allergies),
      dietaryDefinitions: validator.escape(req.user.dietaryDefinitions),
      preferences: validator.escape(req.user.preferences),
      religiousRestrictions: validator.escape(req.user.religiousRestrictions),
      recipes: validator.escape(req.user.recipes),

      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.json(safeUserObject || null);
};