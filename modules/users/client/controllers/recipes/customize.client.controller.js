(function () {
  'use strict';

  angular
    .module('users')
    .controller('CustomizeController', CustomizeController);

  CustomizeController.$inject = ['UsersService', '$scope', '$stateParams', '$http', 'Notification', '$state', '$timeout'];

  function CustomizeController(UsersService, $scope, $stateParams, $http, Notification, $state, $timeout) {
    var vm = this;

    $scope.loading = true;
    $timeout( function() {
      $scope.loading = false
    }, 5000);
    
    // Get map and recipe/ingredients from previous state
    $scope.recipe = $stateParams.recipe;
    $scope.alternatives = $stateParams.multiple_map;

    // Get alternative data
    if($scope.alternatives) {
      $scope.alternatives.forEach( (alternative) => {
        alternative.map_name = alternative.map_name;
      });

      getR();
    }

    // Get ingredients data and initialize user choices
    if($scope.recipe) {
      $scope.ingredients = $scope.recipe.ingredients;

      $scope.ingredients.forEach( (ingredient) => {
        ingredient.name = ingredient.name;
        ingredient.choice = ingredient.name;
      });
    }

    // Make first letter upercase
    // function uppercaseFirstLetter(string) {
    // 	return string.charAt(0).toUpperCase() + string.slice(1);
    // }

    // Save new ingredients to the recipe
    $scope.saveIngredients = function() {
      var recipe = angular.copy($scope.recipe);

      // Get the new ingredients to save
      recipe.ingredients.forEach( (ingredient) => {
         ingredient.name = ingredient.choice;
      }); 
      
      // Calls API to save the recipe
      UsersService.updateMyRecipe(recipe)
        .then(updateSuccess)
        .catch(updateFailure);

      function updateSuccess(response) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Update recipe successful!' });
      }

      function updateFailure(response) {
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Update recipe failed!' })
      }
    }

    // Search through each alternative and getReport for each one
    async function getR() {
    	var alternatives = await $scope.alternatives;

    	alternatives.forEach( (alternative, i) => {
        if(alternative.map_name === "No alternatives available"){
          alternatives[i] = "";
          alternative.none = true;
        }
        else {
          alternative.forEach( (alt, j) => {
            getReport(alt);
            alternative.none = false
          });
        }
	    });
    }

    // API KEY
    var apiKey = 'YAJ2M9l67OaqNMPCEfBcoccVtQDY5LPUR20rFzP8';
    
    // FOR REPORT
    var type = 'b';
    var format = 'json';

    // FOR INDIVIDUAL SEARCHES
    var sort = 'n';
    var max = '200';
    var ds = 'Standard Reference';

    function getReport (alternative) {
      var reportURL = 
          'https://api.nal.usda.gov/ndb/reports/' + 
          '?ndbno=' + alternative.map_ndbno + 
          '&type=' + type + 
          '&format=' + format + 
          '&api_key=' + apiKey; 

      getURL(reportURL)
          .then((results) => {
            $scope.searched = results.data;
            assignFood(alternative);
          });
    };

    // Get nutrients of ingredients
    function assignFood(alternative) {
      $scope.food = $scope.searched.report.food.name.toLowerCase();
      alternative.nutrients = [];

      $scope.searched.report.food.nutrients.forEach((nutrient, i) => {
        if (nutrient.name === 'Protein') alternative.nutrients.push(nutrient);
        else if (nutrient.name === 'Total lipid (fat)') alternative.nutrients.push(nutrient);
        else if (nutrient.name === 'Carbohydrate, by difference') alternative.nutrients.push(nutrient);
        else if (nutrient.name === 'Sugars, total') alternative.nutrients.push(nutrient);
      });
    }

    function getURL(url) {
      return $http.get(url);
    }
  }
}());
