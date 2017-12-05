(function () {
  'use strict';

  angular
    .module('core')
    .controller('LeaderboardController', LeaderboardController);

  LeaderboardController.$inject = ['$scope', 'Authentication', 'Notification', 'CommunityService', '$state', '$timeout'];

  function LeaderboardController($scope, Authentication, Notification, CommunityService, $state, $timeout) {
    var vm = this;
    vm.authentication = Authentication;

    $scope.loading = true;
    $timeout( function() {
      $scope.loading = false
    }, 2000);

    CommunityService.getLeaderboard()
      .then(getSuccess)
      .catch(getFailure);

    function getSuccess(response) {
      vm.leaders = response.leaders;
    }

    function getFailure(response) {
      console.log(response);
    }
  }
}());