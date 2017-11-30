(function () {
  'use strict';

  angular
    .module('core')
    .controller('LeaderboardController', LeaderboardController);

  LeaderboardController.$inject = ['$scope', 'Authentication', 'Notification', 'CommunityService', '$state'];

  function LeaderboardController($scope, Authentication, Notification, CommunityService, $state) {
    var vm = this;
    vm.authentication = Authentication;

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