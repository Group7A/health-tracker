(function () {
  'use strict';

  angular
    .module('users')
    .controller('AlternativesController', AlternativesController);

  AlternativesController.$inject = ['UsersService', 'TransferService', '$scope', '$stateParams'];

  function AlternativesController(UsersService, TransferService, $scope, $stateParams) {
    var vm = this;

    // Get maps and recipe/ingredients from previous state 
    $scope.recipe = $stateParams.recipe;
    $scope.healthy_alternatives = $stateParams.healthy_map;
    $scope.truest_alternatives = $stateParams.truest_map;
    $scope.multiple_alternatives = $stateParams.multiple_map;
    $scope.ingredients = $scope.recipe.ingredients;

    // Toggle between healthy and truest to taste views
    $scope.health = false;
    $scope.truest = false;

    $scope.showHealthy = function () {
      $scope.health = false;
      $scope.truest = false;
    }

    $scope.showTruest = function () {
      $scope.truest = true;
      $scope.health = true;
    }

    // Make first letter upercase
    $scope.uppercaseFirstLetter = function(string) {
    	return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }
}());
