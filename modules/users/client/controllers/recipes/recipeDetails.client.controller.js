(function () {
  'use strict';

  angular
    .module('users')
    .controller('RecipeDetailsController', RecipeDetailsController);

  RecipeDetailsController.$inject = ['UsersService', 'DetailsService', 'CommunityService', '$stateParams', '$scope', 'Notification'];

  function RecipeDetailsController(UsersService, DetailsService, CommunityService, $stateParams, $scope, Notification) {
    var vm = this;

    $scope.recipe = $stateParams.recipeDetails;
    //$scope.recipe = $stateParams;

    if($scope.recipe.directionsList.length > 0) $scope.showDirections = true;
    else $scope.showDirections = false;
    console.log($scope.recipe);

    // ======== ADD A RECIPE ===========
    $scope.add = (recipe) => {
      CommunityService.addRecipe(recipe)
        .then(addRecipeSuccess)
        .catch(addRecipeFailure);
    };

    function addRecipeSuccess(response) {
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Add recipe successful!' });
    }

    function addRecipeFailure(response) {
      Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Add recipe failed!' });
    }
  }
}());
