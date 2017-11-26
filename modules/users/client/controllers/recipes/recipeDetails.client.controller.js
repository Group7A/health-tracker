(function () {
  'use strict';

  angular
    .module('users')
    .controller('RecipeDetailsController', RecipeDetailsController);

  RecipeDetailsController.$inject = ['UsersService', 'DetailsService', '$stateParams', '$scope'];

  function RecipeDetailsController(UsersService, DetailsService, $stateParams, $scope) {
    var vm = this;

    //$scope.recipe = $stateParams.recipeDetails;
    $scope.recipe = $stateParams;
    //$scope.recipe = DetailsService.get($stateParams.recipeID);
    console.log($scope.recipe);

    if($scope.recipe.directionsList.length > 0) $scope.showDirections = true;
    else $scope.showDirections = false;
  }
}());
