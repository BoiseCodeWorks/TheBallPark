(function() {
  'use strict';

  angular.module('app', [])
  .constant('Positions',(function(){
    return [
      "bench",
      "pitcher",
      "catcher",
      "first",
      "second",
      "third",
      "short",
      "left",
      "center",
      "right",
    ]
  })())
})();

(function() {
  'use strict';

  angular
    .module('app')
    .controller('FieldController', FieldController);

  FieldController.$inject = ['$scope'];
  function FieldController($scope) {
    var vm = this;


    activate();

    ////////////////

    function activate() {

    }


    var ml = 387;
    var cl = 447;

    var positions = {
      left: { top: 226, left: 144 },
      center: { top: 95, left: 387 },
      right: { top: 226, left: 656 },
      second: { top: 330, left: 457 },
      third: { top: 395, left: 250 },
      pitch: { top: 447, left: 387 },
      first: { top: 395, left: 515 },
      catcher: { top: 636, left: 387 },
    }

    var bases = {
      first: { top: 447, left: 536 },
      second: { top: 299, left: 387 },
      third: { top: 447, left: 238 },
      home: { top: 599, left: 387 },
    }

  }
})();




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
(function() {
  'use strict';

  ControllerController.$inject = ["Positions"];
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
  function ControllerController(Positions) {
    var vm = this;
    vm.positions = Positions;
  }
})();