(function() {
  'use strict';

  angular
    .module('app')
    .controller('GameController', GameController);

  GameController.$inject = ['Positions'];
  function GameController(Positions) {

    this.game = {
      id: 1,
      inning: 4,
      isTop: false,
    }

    this.homeTeam = {
      name: "The Bulls",
      runs: 0,
      players: [],
      addPlayer: (player) => {
      }
    };

    this.awayTeam = {
      name: "The Storm",
      runs: 0,
      players: [],
      addPlayer: (player) => {
      }
    };

    var t1 = [8, 7, 3, 18, 33, 59, 42, 22, 27, 16, 19, 34];
    var t2 = [2, 11, 18, 23, 44, 46, 1, 3, 9, 18, 25, 53];

    this.getPlayerClass = (player) => {
      var atBat = this.isTop && player.team === this.homeTeam;
    }
  }
})();