(function () {
  'use strict';

  angular
    .module('users')
    .controller('CustomizeController', CustomizeController);

  CustomizeController.$inject = ['UsersService', '$scope', '$stateParams', '$http', 'Notification'];

  function CustomizeController(UsersService, $scope, $stateParams, $http, Notification) {
    var vm = this;
    
    // Get map and recipe/ingredients from previous state
    $scope.recipe = $stateParams.recipe;
    $scope.recipe.editAfterAdd = true;
    $scope.alternatives = $stateParams.multiple_map;
    $scope.ingredients = $scope.recipe.ingredients;
    var newIngredients = $scope.recipe.ingredients;
    $scope.choices = [];

    // Make first letter upercase
    // $scope.uppercaseFirstLetter = function(string) {
    // 	return string.charAt(0).toUpperCase() + string.slice(1);
    // }

    $scope.newIngredient = function(ing, i) {
      newIngredients[i] = {
        "name": ing
      };

      console.log(newIngredients);
    }

    $scope.saveIngredients = function() {
      var recipe = $scope.recipe;
      recipe.ingredients.forEach( (ingredient, i) => {
         ingredient.name = newIngredients[i].name;
      }); 
      
      UsersService.updateMyRecipe(recipe)
        .then(updateSuccess)
        .catch(updateFailure);

      function updateSuccess(response) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Update recipe successful!' })
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

    getR();

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
