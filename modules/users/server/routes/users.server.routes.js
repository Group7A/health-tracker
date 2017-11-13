'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  app.route('/api/users/deleteRecipe').post(users.deleteRecipe);
  app.route('/api/users/alternatives').post(users.alternatives);
  app.route('/api/users/add').post(users.add);
  app.route('/api/users/myRecipes').get(users.myRecipes);
  app.route('/api/users/community').get(users.listRecipes);

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
