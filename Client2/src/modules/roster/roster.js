(function() {
  'use strict';

  angular
    .module('app')
    .directive('roster', Roster);

  Roster.$inject = [];
  function Roster() {
    // Usage:
    //
    // Creates:
    //
    var directive = {
        bindToController: true,
        controller: ControllerController,
        controllerAs: 'vm',
        restrict: 'E',
        templateUrl: '/modules/roster/roster.html',
        scope: {
        }
    };
    return directive;

  }
  /* @ngInject */
  function ControllerController (Positions) {
    var vm = this;
    vm.positions = Positions;
  }
})();