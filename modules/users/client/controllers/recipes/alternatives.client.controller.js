(function () {
  'use strict';

  angular
    .module('users')
    .controller('AlternativesController', AlternativesController);

  AlternativesController.$inject = ['UsersService', 'TransferService', '$scope', '$stateParams'];

  function AlternativesController(UsersService, TransferService, $scope, $stateParams) {
    var vm = this;

    // $scope.alternatives = TransferService.getAlternatives();
    // $scope.recipe = TransferService.getRecipe();

    $scope.recipe = $stateParams.recipe;
    $scope.healthy_alternatives = $stateParams.healthy_map;
    $scope.truest_alternatives = $stateParams.truest_map;
    $scope.health = true;
    $scope.truest = false;

    console.log("Here are healthy alternatives: ", $scope.healthy_alternatives);
    console.log("Here are truest alternatives: ", $scope.truest_alternatives);
    console.log("Here is the recipe", $scope.recipe);

    $scope.ingredients = $scope.recipe.ingredients;

    /*$scope.switch = () => {
      $scope.health = !$scope.health;
    }*/

    $scope.showHealthy = function () {
      $scope.health = true;
      $scope.truest = false;
    }
    $scope.showTruest = function () {
      $scope.truest = true;
      $scope.health = false;
    }

    // TODO: Sort through alternatives and get healthiest and truest to taste
    // $scope.ingredients.forEach( (ingredient, i) => {
    //   $scope.alternatives.forEach( (alternative, j) => {
        
    //   });
    // });
    
    /*
    //Alternative Getter
		var apiKey = 'YAJ2M9l67OaqNMPCEfBcoccVtQDY5LPUR20rFzP8';
		var type = "b";
		var format = "json";
		var sort = "n";
		var max = "200";
		var ds = 'Standard Reference';
    $scope.getReport = (searchedItem) => {
			var reportURL = 
			  	"http://api.nal.usda.gov/ndb/reports/" + 
			  	"?ndbno=" + searchedItem + 
          "&type=" + type + 
          "&format=" + format + 
          "&api_key=" + apiKey; 

        getURL(reportURL)
          .then( (results) => {
            $scope.searched = results.data;
            assignFood();
          });
    }

    function assignFood() {
			$scope.food = $scope.searched.report.food.name.toLowerCase();
			$scope.nutrients = $scope.searched.report.food.nutrients;
		}

    function getURL(url) {
			return $http.get(url);
		}
 
    //vm.customizings = UserssService.query();

      function searchAssign(food){
        vm.searchFood = food;
      }*/
      
  }
}());
