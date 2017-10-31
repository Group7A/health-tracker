(function () {
  'use strict';

  angular
    .module('core')
    .controller('SearchController', SearchController);

  SearchController.$inject = ['$scope', 'menuService', 'TransferService'];

  function SearchController($scope, menuService, TransferService) {
    $scope.pages = [{name:"Whole Milk", calories:"105", protein:"8", sugar:"13", fat:"2.5"},
                    {name:"Comparison View", show: false}
    ]
    $scope.wholename = "Whole Milk";
    $scope.wholeCal = "105";
    $scope.wholePro = "8";
    $scope.wholeSug = "13";
    $scope.wholeFat = "2.5";

    var vm = this;

    //DO YOUR FRONTEND JS CODE HERE
    $scope.alert = () => {
		  alert('hello');
    }

    // $scope.show = function(item){
    //   console.log("completed");
    //   item.show = !item.show;
    // }

    $scope.showItem = true;
    $scope.showComparison = false;
    $scope.flipped = false;

    $scope.showI = function() {
      if($scope.showItem==false){
        $scope.showItem = true;
        $scope.showComparison = false;
      }
      //$scope.showItem = !$scope.showItem;
    }

    $scope.showC = function() {
      if($scope.showComparison==false){
        $scope.showComparison = true;
        $scope.showItem = false;
      }
      //$scope.showItem = !$scope.showItem;
    }

    $scope.flip = function() {
      $scope.flipped = !$scope.flipped;
    }

    $scope.alternatives = TransferService.getAlternatives();
    //$scope.ingredient = TransferService.getIngredient();
    console.log("Here are alternatives: ", $scope.alternatives);
    //console.log("Here is the ingredient", $scope.ingredient);

    // API KEY
		var apiKey = 'YAJ2M9l67OaqNMPCEfBcoccVtQDY5LPUR20rFzP8';

		// FOR REPORT
		var type = "b";
		var format = "json";

		// FOR INDIVIDUAL SEARCHES
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

  }
}());
