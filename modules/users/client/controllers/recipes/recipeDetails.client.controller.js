(function () {
  'use strict';

  angular
    .module('users')
    .controller('RecipeDetailsController', RecipeDetailsController);

  RecipeDetailsController.$inject = ['UsersService', 'DetailsService', 'CommunityService', '$stateParams', '$scope', 'Notification'];

  function RecipeDetailsController(UsersService, DetailsService, CommunityService, $stateParams, $scope, Notification) {
    var vm = this;

    $scope.recipe = $stateParams.recipeDetails;
    console.log($scope.recipe);

    // DIRECTIONS
    if($scope.recipe.directionsList.length > 0) $scope.showDirections = true;
    else $scope.showDirections = false;

    // RATING
    if($scope.recipe.review.length > 0) {
      $scope.recipe.totalRating = averageStars($scope.recipe.review);
    }
    else $scope.recipe.totalRating = 0;

    function averageStars(starsArray) {
      var total = 0;

      for(var i = 0; i < starsArray.length; i++) {
          total += starsArray[i].rating;
      }

      var avg = total / starsArray.length;
      return avg;
    }

    $scope.getNumber = (num) => {
      return new Array(num); 
    }

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

    // RATING FROM USER
    $scope.getStars = (number) => {
      $scope.rating = number;
    }

    // Submit Review
    $scope.submitReview = () => {
      $scope.recipe.review.push({
        'rating': $scope.rating,
        'writtenReview': $scope.writtenReview
      });

      UsersService.updateMyRecipe($scope.recipe)
        .then(updateSuccess)
        .catch(updateFailure);

      function updateSuccess(response) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Review submitted!' });
      }

      function updateFailure(response) {
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Review submission failed!' })
      }
    };
  }
}());
