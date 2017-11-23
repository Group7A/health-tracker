(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', 'Authentication', 'Notification', 'TransferService', 'CommunityService', '$state'];

  function HomeController($scope, Authentication, Notification, TransferService, CommunityService, $state) {
    var vm = this;

    vm.authentication = Authentication;

    // CALORIE SLIDER
    var slider = document.getElementById('calories');
    var output = document.getElementById('calVal');
    output.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
      output.innerHTML = this.value;
    };

    // ========= SHOW COMMUNITY OR MY RECIPES ========
    $scope.showCommunity = true;

    $scope.showPopular = () => {
      $scope.showCommunity = true;
    };

    $scope.showMyRecipes = () => {
      $scope.showCommunity = false;
    };

    // =========== GET COMMUNITY RECIPES ============
    CommunityService.getList()
      .then(CommunityRecipeSuccess)
      .catch(failure);

    async function CommunityRecipeSuccess(response) {
      $scope.communityRecipes = await response;
      $scope.communityRecipesFiltered = [];

      // Filter through all recipes and put them in one array
      for(var recipe in $scope.communityRecipes) { 
        for(var rec in $scope.communityRecipes[recipe]) {
          if($scope.communityRecipes[recipe][rec]._id) { // Directions means its a recipe
            $scope.communityRecipesFiltered.push($scope.communityRecipes[recipe][rec]); 
          };
        }
      }

      for(var recipe in $scope.communityRecipesFiltered) {
        if($scope.communityRecipesFiltered[recipe].review.length > 0) {
          $scope.communityRecipesFiltered[recipe].totalRating = averageStars($scope.communityRecipesFiltered[recipe].review);
        }
        else $scope.communityRecipesFiltered[recipe].totalRating = 0;
      };
    }

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

    // ======== GET MY RECIPES =========
    CommunityService.getMyRecipes()
      .then(MyRecipeSuccess)
      .catch(failure);

    function MyRecipeSuccess(response) {
      $scope.myRecipes = response.recipes;

      for(var recipe in $scope.myRecipes) {
        if($scope.myRecipes[recipe].review.length > 0) {
          $scope.myRecipes[recipe].totalRating = averageStars($scope.myRecipes[recipe].review);
        }
        else $scope.myRecipes[recipe].totalRating = 0;
      };
    }

    function failure(error) {
      console.log('Failure: ', error);
    }  

    // ======== ADD A RECIPE ===========
    $scope.add = (recipe) => {
      CommunityService.addRecipe(recipe)
        .then(addRecipeSuccess)
        .catch(addRecipeFailure);
    };

    function addRecipeSuccess(response) {
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Add recipe successful!' });

      CommunityService.getList()
        .then(CommunityRecipeSuccess)
        .catch(failure);

      CommunityService.getMyRecipes()
        .then(MyRecipeSuccess)
        .catch(failure);
    }

    function addRecipeFailure(response) {
      Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Add recipe failed!' });
    }

    // ========= DELETE RECIPE ============
    $scope.delete = (myRecipe) => {
      var myRecipeIndex = {
        'index': $scope.myRecipes.indexOf(myRecipe)
      };

      CommunityService.deleteThisRecipe(myRecipeIndex)
        .then(deleteRecipeSuccess)
        .catch(deleteRecipeFailure);
    };

    function deleteRecipeSuccess(response) {
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Delete recipe successful!' });

      // Get updated community and my recipes
      CommunityService.getList()
        .then(CommunityRecipeSuccess)
        .catch(failure);

      CommunityService.getMyRecipes()
        .then(MyRecipeSuccess)
        .catch(failure);
    }

    function deleteRecipeFailure(response) {
      Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Delete recipe failed!' });
    }

    // RATING FILTER
    $scope.ratingFilter = true;
    $scope.highestRating = true;

    $scope.ratingFilterOption = (highestOrLowest) => {
      if(highestOrLowest === 'highest') {
        $scope.ratingFilter = true;
        $scope.highestRating = true;
        $scope.lowestRating = false;
      }
      else {
        $scope.ratingFilter = false;
        $scope.highestRating = false;
        $scope.lowestRating = true;
      }
    }

    // COOKING STYLE FILTER
    $scope.showAny = true;
    $scope.showBaked = false;
    $scope.showFried = false;
    $scope.showGrilled = false;

    $scope.cookingStyleFilter = (style) => {
      if(style === 'any') {
        $scope.showAny = true;
        $scope.showBaked = false;
        $scope.showFried = false;
        $scope.showGrilled = false;
      }
      else if(style === 'baked') {
        $scope.showAny = false;
        $scope.showBaked = true;
        $scope.showFried = false;
        $scope.showGrilled = false;
      }
      else if(style === 'fried') {
        $scope.showAny = false;
        $scope.showBaked = false;
        $scope.showFried = true;
        $scope.showGrilled = false;
      }
      else if(style === 'grilled') {
        $scope.showAny = false;
        $scope.showBaked = false;
        $scope.showFried = false;
        $scope.showGrilled = true;
      }
    }

    $scope.checkStyle = (recipe) => {
      if($scope.showBaked && recipe.cookingStyle != 'baked') return false;
      else if($scope.showFried && recipe.cookingStyle != 'fried') return false;
      else if($scope.showGrilled && recipe.cookingStyle != 'grilled') return false;
      else return true; 
    }

    // HEALTH CLASSIFICATION FILTER
    $scope.showAnyClass = true;
    $scope.showGlutenFree = false;
    $scope.showNoSugar = false;
    $scope.showLowFat = false;
    $scope.showVegan = false;
    $scope.showLowCalorie = false;

    $scope.healthClassificationFilter = (classif) => {
      if(classif === 'any') {
        $scope.showAnyClass = true;
        $scope.showGlutenFree = false;
        $scope.showNoSugar = false;
        $scope.showLowFat = false;
        $scope.showVegan = false;
        $scope.showLowCalorie = false;
      }
      else if(classif === 'glutenFree') {
        $scope.showAnyClass = false;
        $scope.showGlutenFree = true;
        $scope.showNoSugar = false;
        $scope.showLowFat = false;
        $scope.showVegan = false;
        $scope.showLowCalorie = false;
      }
      else if(classif === 'noSugar') {
        $scope.showAnyClass = false;
        $scope.showGlutenFree = false;
        $scope.showNoSugar = true;
        $scope.showLowFat = false;
        $scope.showVegan = false;
        $scope.showLowCalorie = false;
      }
      else if(classif === 'lowFat') {
        $scope.showAnyClass = false;
        $scope.showGlutenFree = false;
        $scope.showNoSugar = false;
        $scope.showLowFat = true;
        $scope.showVegan = false;
        $scope.showLowCalorie = false;
      }
      else if(classif === 'vegan') {
        $scope.showAnyClass = false;
        $scope.showGlutenFree = false;
        $scope.showNoSugar = false;
        $scope.showLowFat = false;
        $scope.showVegan = true;
        $scope.showLowCalorie = false;
      }
      else if(classif === 'lowCalorie') {
        $scope.showAnyClass = false;
        $scope.showGlutenFree = false;
        $scope.showNoSugar = false;
        $scope.showLowFat = false;
        $scope.showVegan = false;
        $scope.showLowCalorie = true;
      }
    }

    $scope.checkClassif = (recipe) => {
      if($scope.showGlutenFree && !recipe.healthClassifications.glutenFree) return false;
      else if($scope.showNoSugar && !recipe.healthClassifications.noSugar) return false;
      else if($scope.showLowFat && !recipe.healthClassifications.lowFat) return false;
      else if($scope.showVegan && !recipe.healthClassifications.vegan) return false;
      else if($scope.showLowCalorie && !recipe.healthClassifications.lowCalorie) return false;
      else return true; 
    }
  }
}());
