(function () {
  'use strict';

  angular
    .module('users')
    .controller('AddRecipeController', AddRecipeController);

  AddRecipeController.$inject = ['UsersService', 'TransferService', '$scope', '$http', 
      'Authentication', 'Notification', '$location'];

  function AddRecipeController(UsersService, TransferService, $scope, $http, 
      Authentication, Notification, $location) {
    var vm = this;

    vm.user = Authentication.user;
    vm.updateMyRecipes = updateMyRecipes;

    $scope.recipe = {
      'name' : '',
      'directions' : '',
      'cookingStyle' : '',
      'ingredients' : [{
        'name' : '',
        'quantity' : '',
        'units' : ''
      }]
    };

    function updateMyRecipes(isValid) {
      var recipe = $scope.recipe;
      getAlternatives();

      if(!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.addRecipeForm');
        return false;
      }

      //var user = new UsersService(vm.user);
      //console.log("User ", user);

      UsersService.addRecipe(recipe)
        .then(success)
        .catch(failure);

      function success(response) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Add recipe successful!' })
        console.log("Recipes success: ", response);
        //$scope.recipes = response.recipes;
      }

      function failure(response) {
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Add recipe failed!' })
        console.log("Failure: ", response);
      }

      TransferService.setRecipe(recipe);
      $location.path('/alternatives');
    }

    // GET ALTERNATIVES FROM RECIPE
    $scope.map = [];
		$scope.in_food_group;
		$scope.orig_nutrient_amount;
		$scope.all_alt_in_group = [];
		$scope.have_match = 0;
		$scope.c_method = "baked";
    $scope.search = "butter";

    function getAlternatives() {
      $scope.map = [];
      $scope.orig_nutrient_amount = 0;

      $http.get('./modules/users/client/controllers/recipes/food_alternatives.json')
        .then( (response) => {
          response.data.cooking_methods.forEach( (cooking_method, i) => {
						cooking_method.food_groups.forEach( (food_group, j) => {
							food_group.food_alts.forEach( (food_alt, k) => {

								if((food_alt.db_name == $scope.search) && ($scope.c_method == cooking_method.method_name)){
									$scope.have_match = 1;
									$scope.orig_ndbno = food_alt.db_ndbno;
									$scope.in_food_group = food_group.group_name;
									$scope.orig_nutrient_amount = food_alt.db_main_nutrient.db_amount;
								}
								else{
									$scope.all_alt_in_group.push(food_alt);
								}
							});
							if($scope.have_match == 1){
								$scope.all_alt_in_group.forEach((alt_item, i) => {
									if(alt_item.db_main_nutrient.db_amount < $scope.orig_nutrient_amount){
										$scope.map.push({"map_ndbno": alt_item.db_ndbno, "map_name": alt_item.db_name});
									}
								});
							}
							$scope.have_match = 0;
							$scope.all_alt_in_group = [];
						});
					});
        });
        TransferService.setAlternatives($scope.map);
    }

    // Add to ingredient list
    $scope.recipeList = [{}];

    $scope.recipeAdd = function() {
        $scope.recipeList.push({});
    };


    //vm.addings = UsersService.query();
  }
}());
