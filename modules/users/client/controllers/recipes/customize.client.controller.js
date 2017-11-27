(function () {
  'use strict';

  angular
    .module('users')
    .controller('CustomizeController', CustomizeController);

  CustomizeController.$inject = ['UsersService', '$scope', '$stateParams', '$http'];

  function CustomizeController(UsersService, $scope, $stateParams, $http) {
    var vm = this;
    
    $scope.recipe = $stateParams.recipe;
    $scope.alternatives = $stateParams.multiple_map;
    $scope.ingredients = $scope.recipe.ingredients;

    $scope.uppercaseFirstLetter = function(string) {
    	return string.charAt(0).toUpperCase() + string.slice(1);
    }

    //search through each alternative and getReport for each one
    async function getR() {
    	var alternatives = await $scope.alternatives;

    	alternatives.forEach( (alternative, i) => {
	    	alternative.forEach( (alt, j) => {
           getReport(alt);
            if(i==0){
              $scope.name = alternative.map_name;
            }
        });
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
          'http://api.nal.usda.gov/ndb/reports/' + 
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
        //else if (nutrient.name === 'Fiber, total dietary') alternative.nutrients.push(nutrient);
        else if (nutrient.name === 'Sugars, total') alternative.nutrients.push(nutrient);
        //else if (nutrient.name === 'Cholesterol') alternative.nutrients.push(nutrient);
      });
    }

    function getURL(url) {
      return $http.get(url);
    }
  }
}());
