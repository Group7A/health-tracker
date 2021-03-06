(function () {
  'use strict';

  angular
    .module('core')
    .controller('SearchController', SearchController);

  SearchController.$inject = ['$scope', 'menuService', 'TransferService', '$http', '$stateParams'];

  function SearchController($scope, menuService, TransferService, $http, $stateParams) {
    var vm = this;

    // Flip between item view and comparison view
    $scope.showItem = true;
    $scope.showComparison = false;
    $scope.flipped = false;

    $scope.showI = function () {
      if ($scope.showItem === false) {
        $scope.showItem = true;
        $scope.showComparison = false;
      }
    };

    $scope.showC = function () {
      if ($scope.showComparison === false) {
        $scope.showComparison = true;
        $scope.showItem = false;
      }
    };

    // Flip between nutrional values and pictures
    $scope.flip = function(alternative) {
      alternative.flipped = !alternative.flipped;
    }

    // Function to make first letter uppercase
    $scope.uppercaseFirstLetter = function(string) {
    	return string.charAt(0).toUpperCase() + string.slice(1);
	  }

    // Get data from header controller
    $scope.alternatives = TransferService.getAlternatives();
    $scope.name = 'No Search';

    // Search through each alternative and getReport for each one
    async function getUSDAResults() {
    	var alternatives = await $scope.alternatives;

      if(alternatives.length > 0) {
        alternatives.forEach( (alternative, i) => {
          getReport(alternative);
          getImage(alternative);
          if(i==0){
            $scope.name = alternative.map_name;
          }
        });
      }
      else $scope.name = 'No Search';
    }

    getUSDAResults();

    // USDA API Key  and information for API
    var apiKey = 'YAJ2M9l67OaqNMPCEfBcoccVtQDY5LPUR20rFzP8';
    var type = 'b';
    var format = 'json';
    var sort = 'n';
    var max = '200';
    var ds = 'Standard Reference';

    // Get USDA API info
    function getReport (alternative) {
      var reportURL = 
          'http://api.nal.usda.gov/ndb/reports/' + 
          '?ndbno=' + alternative.map_ndbno + 
          '&type=' + type + 
          '&format=' + format + 
          '&api_key=' + apiKey; 

      // $http.get 
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
    }

    function getURL(url) {
      return $http.get(url);
    }

    // TODO - Get actual images. Overloading API right now
    async function getImage(food) {
      // let subscriptionKey = '6e4bbfc395054217a71390d8b08ff40b';
      // let host = 'https://api.cognitive.microsoft.com';
      // let path = '/bing/v7.0/search';
      // let search = food.name + ' food';

      // let req = {
      //     method : 'GET',
      //     url: host + path + '?q=' + encodeURIComponent(search),
      //     headers : {
      //         'Ocp-Apim-Subscription-Key' : subscriptionKey,
      //     }
      // };

      // await $http(req)
      //   .then( (response) => {
      //     food.image = response.data.images.value[0].contentUrl;
      //   })
      //   .catch( (err) => {
      //     console.log(err);
      //   });
      food.image = "./modules/core/client/img/no-image.jpg";
    }
  }
}());
