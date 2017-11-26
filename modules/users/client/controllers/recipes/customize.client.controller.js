(function () {
  'use strict';

  angular
    .module('users')
    .controller('CustomizeController', CustomizeController);

  CustomizeController.$inject = ['UsersService', '$scope', '$stateParams'];

  function CustomizeController(UsersService, $scope, $stateParams) {
    var vm = this;

    $scope.wholename = "Whole Milk";
    $scope.wholeQua = "3"
    $scope.wholeUni = "Cups"
    $scope.wholeCal = "105";
    $scope.wholePro = "8";
    $scope.wholeSug = "13";
    $scope.wholeFat = "2.5";

   	$scope.name = "TEST ALERT";
    //DO YOUR FRONTEND JS CODE HERE
    $scope.alert = function(){
    	// var input = document.getElementById("inputEmail3").value;
    	//alert(input)
		  alert($scope.name);
    }
    
    $scope.recipe = $stateParams.recipe;
    $scope.multiple_alternatives = $stateParams.multiple_map;

    console.log("Here is the recipe", $scope.recipe);
    
    $scope.ingredients = $scope.recipe.ingredients;

    //console.log($stateParams.multiple_map);
    console.log($scope.multiple_alternatives);

    
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
            else if (nutrient.name === 'Fiber, total dietary') alternative.nutrients.push(nutrient);
            else if (nutrient.name === 'Sugars, total') alternative.nutrients.push(nutrient);
            else if (nutrient.name === 'Cholesterol') alternative.nutrients.push(nutrient);
          });
    
          console.log('nutrients: ', alternative.nutrients);
        }
    
        function getURL(url) {
          return $http.get(url);
        }
    


    // vm.customizings = UsersService.query();
  }
}());
