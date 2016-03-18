(function() {
  'use strict';

  angular
    .module('app')
    .controller('GameController', GameController);

  GameController.$inject = ['Positions'];
  function GameController(Positions) {
    this.positions = Positions;
    this.homeTeam = {
      name: "The Bulls",
      players: [
        { number: 2, position: "pitcher" },
        { number: 11, position: "catcher" },
        { number: 18, position: "first" },
        { number: 23, position: "second" },
        { number: 44, position: "third" },
        { number: 46, position: "short" },
        { number: 1, position: "left" },
        { number: 3, position: "center" },
        { number: 9, position: "right" },
        { number: 18, position: "" },
        { number: 25, position: "" },
        { number: 53, position: "" },
      ]
    };
    this.awayTeam = {
      name: "The Storm",
      players: [
        { number: 8, position: "pitcher" },
        { number: 7, position: "catcher" },
        { number: 3, position: "first" },
        { number: 18, position: "second" },
        { number: 33, position: "third" },
        { number: 59, position: "short" },
        { number: 42, position: "left" },
        { number: 22, position: "center" },
        { number: 27, position: "right" },
        { number: 16, position: "" },
        { number: 19, position: "" },
        { number: 34, position: "" },
      ]
    };
  }
})();