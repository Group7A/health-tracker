(function () {
  'use strict';

  angular
    .module('users')
    .controller('AddRecipeController', AddRecipeController);

  AddRecipeController.$inject = ['UsersService', '$scope'];

  function AddRecipeController(UsersService, $scope) {
    var vm = this;

    // TESTING
    var par = {
      'test' : 'world'
    };
    // TESTING
    UsersService.testing(par)
        .then(success)
        .catch(failure);

    function success(response) {
      console.log('worked!');
      console.log(response);
    }

    function failure(response) {
      console.log('sadness')
      console.log(response);
    }
    // END TESTING

    //DO YOUR FRONTEND JS CODE HERE
//===========================================================================
    $scope.recipeList = [{}];

    $scope.recipeAdd = function() {
        $scope.todoList.push({});
    };
//===========================================================================
    $scope.alert = () => {
  		alert('hello');
  	}

    //vm.addings = UsersService.query();
  }
}());
