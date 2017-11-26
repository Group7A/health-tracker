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

    //console.log($stateParams.multiple_map);
    console.log($scope.multiple_alternatives);


    // vm.customizings = UsersService.query();
  }
}());
