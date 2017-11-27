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
    // async function getDetails() {
    //   $scope.recipe = await DetailsService.get({
    //     'recipeID': $stateParams.recipeID
    //   });
    
      // if($scope.recipe.directionsList.length > 0) $scope.showDirections = true;
      // else $scope.showDirections = false;
     console.log($scope.recipe);
    // }

    //getDetails();
    
  }
}());
