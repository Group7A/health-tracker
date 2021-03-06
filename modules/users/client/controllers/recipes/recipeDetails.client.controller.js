(function () {
  'use strict';

  angular
    .module('users')
    .controller('RecipeDetailsController', RecipeDetailsController);

  RecipeDetailsController.$inject = ['UsersService', 'DetailsService', 'CommunityService', 
      '$stateParams', '$scope', 'Notification', 'detailsResolve', 'Authentication'];

  function RecipeDetailsController(UsersService, DetailsService, CommunityService, 
      $stateParams, $scope, Notification, recipe, Authentication) {
    var vm = this;

    vm.user = Authentication.user;
    vm.recipe = recipe;
    $scope.anonymous = false;
    $scope.rating = 0;

    // Directions list
    if(vm.recipe.directionsList.length > 0) $scope.showDirections = true;
    else $scope.showDirections = false;

    // Rating
    if(vm.recipe.review.length > 0) {
      vm.recipe.totalRating = averageStars(vm.recipe.review);
    }
    else vm.recipe.totalRating = 0;

    // Get average number of stars of recipe
    function averageStars(starsArray) {
      var total = 0;

      for(var i = 0; i < starsArray.length; i++) {
          total += starsArray[i].rating;
      }

      var avg = total / starsArray.length;
      return avg;
    }

    // Get number from html
    $scope.getNumber = (num) => {
      return new Array(num); 
    }

    // Add a recipe 
    $scope.add = (rec) => {
      CommunityService.addRecipe(rec)
        .then(addRecipeSuccess)
        .catch(addRecipeFailure);
    };

    function addRecipeSuccess(response) {
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Add recipe successful!' });
    }

    function addRecipeFailure(response) {
      Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> You already own this recipe!' });
    }

    // Rating from user
    $scope.getStars = (number) => {
      $scope.rating = number;
    }

    // Submit Review
    $scope.submitReview = () => {
      vm.recipe.editAfterAdd = false;
      vm.recipe.review.push({
        'rating': $scope.rating,
        'writtenReview': $scope.writtenReview,
        'reviewedBy': $scope.anonymous ? "Anonymous" : vm.user.displayName
      });

      UsersService.reviewOtherRecipe(vm.recipe)
        .then(updateSuccess)
        .catch(updateFailure);

      function updateSuccess(response) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Review submitted!' });
        $scope.rating = 0;
        $scope.writtenReview = '';
        $scope.anonymous = false;

        var star = document.getElementsByName("group-1");
        for(var i=0; i<star.length; i++) star[i].checked = false;

        vm.recipe.totalRating = averageStars(vm.recipe.review);
      }

      function updateFailure(response) {
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Review submission failed!' })
      }
    };
  }
}());
