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
      controller: RosterController,
      controllerAs: 'rc',
      restrict: 'E',
      templateUrl: '/modules/roster/roster.html',
      scope: {
        team: '='
      }
    };
    return directive;

  }
  /* @ngInject */
  function RosterController(Positions) {

    this.positions = Positions;

    this.updatePosition = (player) => {

      if (player.position !== this.positions.bench) {
        this.team.players.filter(x => x !== player && x.position == player.position)
          .forEach(x => x.position = this.positions.bench)
      }
    }


    //this.availablePositions = () => {
    //positions.filter(x => !x || this.team.players.some(p => p.position === x));
    //}
  }
})();