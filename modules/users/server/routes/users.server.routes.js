'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  // Setting up recipe api
  app.route('/api/users/deleteRecipe').post(users.deleteRecipe);
  app.route('/api/users/alternatives').post(users.alternatives);
  app.route('/api/users/add').post(users.add);
  app.route('/api/users/updateRecipe').post(users.updateRecipe);
  app.route('/api/users/reviewRecipe').post(users.reviewRecipe);
  app.route('/api/users/myRecipes').get(users.myRecipes);
  app.route('/api/users/community').get(users.listRecipes);
  app.route('/api/users/leaderboard').get(users.leaderboard);
  app.route('/api/users/details/:recipeID').get(users.getDetails);

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);

  // Finish by binding the user and recipe middleware
  app.param('userId', users.userByID);
  app.param('recipeID', users.recipeByID);
};
