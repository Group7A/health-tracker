(function () {
  'use strict';

  angular
    .module('users')
    .controller('MyRecipesController', MyRecipesController);

  MyRecipesController.$inject = ['UsersService', '$scope'];

  function MyRecipesController(UsersService, $scope, user) {
    var vm = this;

    UsersService.getMyRecipes()
      .then(success)
      .catch(failure)

    function success(response) {
      console.log("Recipes success: ", response.recipes);
      $scope.recipes = response.recipes;
    }

    function failure(response) {
      console.log('sadness')
      console.log("Failure: ", response);
    }
    //vm.addings = UsersService.query();
  }
}());
