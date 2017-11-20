(function () {
  'use strict';

  angular
    .module('users')
    .controller('RecipeDetailsController', RecipeDetailsController);

  RecipeDetailsController.$inject = ['UsersService', '$stateParams', '$scope'];

  function RecipeDetailsController(UsersService, $stateParams, $scope) {
    var vm = this;

    $scope.recipe = $stateParams.recipeDetails;

    if($scope.recipe.directionsList.length > 0) $scope.showDirections = true;
    else $scope.showDirections = false;
  }
}());
