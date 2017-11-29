(function () {
  'use strict';

  angular
    .module('core')
    .controller('LeaderboardController', LeaderboardController);

  LeaderboardController.$inject = ['$scope', 'Authentication', 'Notification', 'CommunityService', '$state'];

  function LeaderboardController($scope, Authentication, Notification, CommunityService, $state) {
    var vm = this;

    vm.authentication = Authentication;

  }
}());