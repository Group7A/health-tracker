(function () {
  'use strict';

  angular
    .module('users')
    .controller('AddRecipeController', AddRecipeController);

  AddRecipeController.$inject = ['UsersService', 'TransferService', '$scope', '$http', 
    'Authentication', 'Notification', '$location', '$state'];

  function AddRecipeController(UsersService, TransferService, $scope, $http, 
      Authentication, Notification, $location, $state) {
    var vm = this;

    vm.user = Authentication.user;
    vm.updateMyRecipes = updateMyRecipes;
    vm.getImage = getImage;

    // Initialize recipe, and ingredients, directions lists
    $scope.ingredientList = [{}];
    $scope.directionsList = [{}];
    $scope.recipe = {
      'name': '',
      'cookingStyle': '',
      'time':'',
      'healthClassifications': {
        'glutenFree': false,
        'noSugar': false,
        'lowFat': false,
        'vegan': false,
        'lowCalorie': false
      },
      'ingredients': [{
        'name': '',
        'quantity': '',
        'units': ''
      }],
      'directionsList': [{
        'directions': ''
      }],
      'review': [{
        'writtenReview': '',
        'rating': ''
      }]
    };

    // GET IMAGE
    async function getImage() {
      let subscriptionKey = '6e4bbfc395054217a71390d8b08ff40b';
      let host = 'https://api.cognitive.microsoft.com';
      let path = '/bing/v7.0/search';
      let search = $scope.recipe.name + ' food';

      let req = {
          method : 'GET',
          url: host + path + '?q=' + encodeURIComponent(search),
          headers : {
              'Ocp-Apim-Subscription-Key' : subscriptionKey,
          }
      };

      await $http(req)
        .then( (response) => {
          $scope.image = response.data.images.value[0].contentUrl;
        })
        .catch( (err) => {
          console.log(err);
        });
    }

    // ADD RECIPE TO MONGO
    function updateMyRecipes(isValid) {
      var recipe = $scope.recipe;
      recipe.image = $scope.image;
      getAlternatives();

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.addRecipeForm');
        return false;
      }

      UsersService.addRecipe(recipe)
        .then(success)
        .catch(failure);

      function success(response) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Add recipe successful!' })
      }

      function failure(response) {
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Add recipe failed!' })
      }

      //TransferService.setRecipe(recipe);
      //$location.path('/alternatives');

      var transferData = {
        'recipe': recipe,
        'healthy_map': $scope.healthy_map,
        'truest_map': $scope.truest_map
      };

      $state.go('alternatives', transferData);
    }

    // Sort alternative ingredients
    async function sort_alt() {
      await $http.get('./modules/users/client/controllers/recipes/food_alternatives.json')
        .then ((response) => {
          $scope.alt_food_object = response.data;

          $scope.alt_food_object.cooking_methods.forEach((cooking_method, i) => {
            cooking_method.food_groups.forEach( (food_group, j) => {
              food_group.food_alts.sort(function(a, b) {
                var nut_valA = a.db_main_nutrient.db_amount;
                var nut_valB = b.db_main_nutrient.db_amount;
                if(nut_valA < nut_valB){
                  return 1;
                }
                else if(nut_valA > nut_valB){
                  return -1;
                }	
                else{
                  return 0;
                }
              });
            });
          });
        });
    }

    sort_alt();

    // GET ALTERNATIVES FROM RECIPE
    function getAlternatives() {
      // Initialize variables
      $scope.healthy_map = [];
      $scope.truest_map = [];
      $scope.in_food_group;
      $scope.orig_nutrient_amount;
      $scope.all_alt_in_group = [];
      $scope.have_match = 0;
      $scope.top_alt_count = 3;
      $scope.mid_ind;

      //$scope.alt_request = 1;
      // 0 - want single healthies alt
      // 1 - want single "tastiest" alt
      // 2 - want 3 alts for ingredients

      // Get alternatives
      $scope.recipe.ingredients.forEach( (ingredient, x) => {
        $scope.alt_food_object.cooking_methods.forEach( (cooking_method, i) => {
          cooking_method.food_groups.forEach( (food_group, j) => {
            food_group.food_alts.forEach( (food_alt, k) => {   
              console.log("Food alt", food_alt.db_name);             
              if((food_alt.db_name == ingredient.name.toLowerCase()) && ($scope.recipe.cookingStyle == cooking_method.method_name)){
                $scope.have_match = 1;
              }
              else if ((food_alt.db_name != ingredient.name) && ($scope.have_match == 1)){
                $scope.all_alt_in_group.push(food_alt);
              }			
            });
            $scope.have_match = 0;
          });
        });
        console.log("All alt in group", $scope.all_alt_in_group);
        // Loop through all the alternatives
        if($scope.all_alt_in_group.length > 0) {
          // HEALTH MAP
          var alt_item = $scope.all_alt_in_group[$scope.all_alt_in_group.length-1];
          $scope.healthy_map.push({"map_ndbno": alt_item.db_ndbno, "map_name": alt_item.db_name, "nutrient": alt_item.db_main_nutrient.db_amount, "flipped": false});

          // TRUEST TO TASTE MAP
          var alt_item = $scope.all_alt_in_group[0];
          $scope.truest_map.push({"map_ndbno": alt_item.db_ndbno, "map_name": alt_item.db_name, "nutrient": alt_item.db_main_nutrient.db_amount, "flipped": false});
        }
        else { // If no alternatives available, send this to the map
          $scope.healthy_map.push({"map_name": 'No alternatives available'});
          $scope.truest_map.push({"map_name": 'No alternatives available'});
        }

        // Empty array for next alternatives
        while($scope.all_alt_in_group.length > 0) {
          $scope.all_alt_in_group.pop();
        }
      });
    }

    // Add an ingredient to the list
    $scope.addIngredient = function () {
      $scope.ingredientList.push({});
    };

    // Remove an ingredient from the list
    $scope.removeIngredientRow = function (ingredient) {
      var index = $scope.recipe.ingredients.indexOf(ingredient);
      $scope.recipe.ingredients.splice(index, 1);
      $scope.ingredientList.splice(index,1);
      $scope.$emit('customerDeleted', ingredient); 
    };

    // Add another direction to the list
    $scope.addDirections = function () {
      $scope.directionsList.push({});
    };

    // Remove a direction from the list
    $scope.removeDirectionsRow = function(direction) {
      var index = $scope.recipe.directionsList.indexOf(direction);
      $scope.recipe.directionsList.splice(index, 1);
      $scope.directionsList.splice(index,1);
      $scope.$emit('customerDeleted', direction); 
    };

    // RATING FROM USER
    $scope.getStars = (number) => {
      $scope.recipe.review[0].rating = number;
    }
  }
}());
