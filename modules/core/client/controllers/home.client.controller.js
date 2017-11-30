(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', 'Authentication', 'Notification', 'TransferService', 'CommunityService', '$state'];

  function HomeController($scope, Authentication, Notification, TransferService, CommunityService, $state) {
    var vm = this;

    vm.authentication = Authentication;
    if(Authentication.user) vm.user = Authentication.user;

    // CALORIE SLIDER - Display the default slider value
    // var slider = document.getElementById('calories');
    // var output = document.getElementById('calVal');
    // output.innerHTML = slider.value; 

    // Update the current slider value (each time you drag the slider handle)
    // slider.oninput = function () {
    //   output.innerHTML = this.value;
    // };

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
      // $scope.communityRecipes = await response;
      // $scope.communityRecipesFiltered = [];
      // $scope.communityNames = [];

      $scope.communityRecipesFiltered = await response.recipes;

      // Filter through all recipes and put them in one array
      // for(var recipe in $scope.communityRecipes) { 
      //   for(var rec in $scope.communityRecipes[recipe]) {
      //     // Check for ID to make sure it's a recipe. Also check if recipe is already in array
      //     if($scope.communityRecipes[recipe][rec]._id && !$scope.communityNames.includes($scope.communityRecipes[recipe][rec].name)) { 
      //       $scope.communityRecipesFiltered.push($scope.communityRecipes[recipe][rec]);
      //       $scope.communityNames.push($scope.communityRecipes[recipe][rec].name);
      //     };
      //   }
      // }

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
      recipe.ownedBy = vm.user.displayName;
      
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
        'index': $scope.myRecipes.indexOf(myRecipe),
        'recipe': myRecipe
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

    // COOKING STYLE FILTER
    $scope.showAny = true;
    $scope.showBeverage = false;
    $scope.showBakedGoods = false;
    $scope.showBakedFoods = false;
    $scope.showFried = false;
    $scope.showFrozenTreats = false;
    $scope.showGrilled = false;
    $scope.showSlowCook = false;
    $scope.showSoup = false;
    $scope.showStoveTop = false;
    $scope.showOthers = false;

    $scope.cookingStyleFilter = (style) => {
      if(style === 'any') {
        $scope.showAny = true;
        $scope.showBeverage = false;
        $scope.showBakedGoods = false;
        $scope.showBakedFoods = false;
        $scope.showFried = false;
        $scope.showFrozenTreats = false;
        $scope.showGrilled = false;
        $scope.showSlowCook = false;
        $scope.showSoup = false;
        $scope.showStoveTop = false;
        $scope.showOthers = false;
      }
      else if(style === 'beverage') {
        $scope.showAny = false;
        $scope.showBeverage = true;
        $scope.showBakedGoods = false;
        $scope.showBakedFoods = false;
        $scope.showFried = false;
        $scope.showFrozenTreats = false;
        $scope.showGrilled = false;
        $scope.showSlowCook = false;
        $scope.showSoup = false;
        $scope.showStoveTop = false;
        $scope.showOthers = false;
      }
      else if(style === 'bakedGoods') {
        $scope.showAny = false;
        $scope.showBeverage = false;
        $scope.showBakedGoods = true;
        $scope.showBakedFoods = false;
        $scope.showFried = false;
        $scope.showFrozenTreats = false;
        $scope.showGrilled = false;
        $scope.showSlowCook = false;
        $scope.showSoup = false;
        $scope.showStoveTop = false;
        $scope.showOthers = false;
      }
      else if(style === 'bakedFoods') {
        $scope.showAny = false;
        $scope.showBeverage = false;
        $scope.showBakedGoods = false;
        $scope.showBakedFoods = true;
        $scope.showFried = false;
        $scope.showFrozenTreats = false;
        $scope.showGrilled = false;
        $scope.showSlowCook = false;
        $scope.showSoup = false;
        $scope.showStoveTop = false;
        $scope.showOthers = false;
      }
      else if(style === 'fried') {
        $scope.showAny = false;
        $scope.showBeverage = false;
        $scope.showBakedGoods = false;
        $scope.showBakedFoods = false;
        $scope.showFried = true;
        $scope.showFrozenTreats = false;
        $scope.showGrilled = false;
        $scope.showSlowCook = false;
        $scope.showSoup = false;
        $scope.showStoveTop = false;
        $scope.showOthers = false;
      }
      else if(style === 'frozenTreats') {
        $scope.showAny = false;
        $scope.showBeverage = false;
        $scope.showBakedGoods = false;
        $scope.showBakedFoods = false;
        $scope.showFried = false;
        $scope.showFrozenTreats = true;
        $scope.showGrilled = false;
        $scope.showSlowCook = false;
        $scope.showSoup = false;
        $scope.showStoveTop = false;
        $scope.showOthers = false;
      }
      else if(style === 'grilled') {
        $scope.showAny = false;
        $scope.showBeverage = false;
        $scope.showBakedGoods = false;
        $scope.showBakedFoods = false;
        $scope.showFried = false;
        $scope.showFrozenTreats = false;
        $scope.showGrilled = true;
        $scope.showSlowCook = false;
        $scope.showSoup = false;
        $scope.showStoveTop = false;
        $scope.showOthers = false;
      }
      else if(style === 'slowCook') {
        $scope.showAny = false;
        $scope.showBeverage = false;
        $scope.showBakedGoods = false;
        $scope.showBakedFoods = false;
        $scope.showFried = false;
        $scope.showFrozenTreats = false;
        $scope.showGrilled = false;
        $scope.showSlowCook = true;
        $scope.showSoup = false;
        $scope.showStoveTop = false;
        $scope.showOthers = false;
      }
      else if(style === 'soup') {
        $scope.showAny = false;
        $scope.showBeverage = false;
        $scope.showBakedGoods = false;
        $scope.showBakedFoods = false;
        $scope.showFried = false;
        $scope.showFrozenTreats = false;
        $scope.showGrilled = false;
        $scope.showSlowCook = false;
        $scope.showSoup = true;
        $scope.showStoveTop = false;
        $scope.showOthers = false;
      }
      else if(style === 'stoveTop') {
        $scope.showAny = false;
        $scope.showBeverage = false;
        $scope.showBakedGoods = false;
        $scope.showBakedFoods = false;
        $scope.showFried = false;
        $scope.showFrozenTreats = false;
        $scope.showGrilled = false;
        $scope.showSlowCook = false;
        $scope.showSoup = false;
        $scope.showStoveTop = true;
        $scope.showOthers = false;
      }
      else if(style === 'others') {
        $scope.showAny = false;
        $scope.showBeverage = false;
        $scope.showBakedGoods = false;
        $scope.showBakedFoods = false;
        $scope.showFried = false;
        $scope.showFrozenTreats = false;
        $scope.showGrilled = false;
        $scope.showSlowCook = false;
        $scope.showSoup = false;
        $scope.showStoveTop = false;
        $scope.showOthers = true;
      }
    }

    $scope.checkStyle = (recipe) => {
      if($scope.showBeverage && recipe.cookingStyle != 'Beverage') return false;
      else if($scope.showBakedGoods && recipe.cookingStyle != 'Baked Goods') return false;
      else if($scope.showBakedFoods && recipe.cookingStyle != 'Baked Foods') return false;
      else if($scope.showFried && recipe.cookingStyle != 'Fried') return false;
      else if($scope.showFrozenTreats && recipe.cookingStyle != 'Frozen Treats') return false;
      else if($scope.showGrilled && recipe.cookingStyle != 'Grilled') return false;
      else if($scope.showSlowCook && recipe.cookingStyle != 'Slow Cook') return false;
      else if($scope.showSoup && recipe.cookingStyle != 'Soup') return false;
      else if($scope.showStoveTop && recipe.cookingStyle != 'Stove Top') return false;
      else if($scope.showOthers && recipe.cookingStyle != 'Others') return false;
      else return true; 
    }
  }
}());
