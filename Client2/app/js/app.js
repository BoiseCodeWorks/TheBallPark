'use strict';

(function () {
  'use strict';

  angular.module('app', ['resources']).constant('Positions', function () {
    return {
      bench: { name: "-Bench-", className: "pos-pine" },
      pitcher: { name: "Pitcher", className: "pos-pitcher" },
      cather: { name: "Catcher", className: "pos-catcher" },
      first: { name: "1st", className: "pos-first" },
      second: { name: "2nd", className: "pos-second" },
      third: { name: "3rd", className: "pos-third" },
      short: { name: "Short", className: "pos-short" },
      left: { name: "Left", className: "pos-left" },
      center: { name: "Center", className: "pos-center" },
      right: { name: "Right", className: "pos-right" }
    };
  }());
})();
'use strict';

(function () {
    'use strict';

    angular.module('app').controller('FieldController', FieldController);

    FieldController.$inject = ['$scope'];
    function FieldController($scope) {
        var vm = this;

        activate();

        ////////////////

        function activate() {}

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
            catcher: { top: 636, left: 387 }
        };

        var bases = {
            first: { top: 447, left: 536 },
            second: { top: 299, left: 387 },
            third: { top: 447, left: 238 },
            home: { top: 599, left: 387 }
        };
    }
})();
'use strict';

(function () {
  'use strict';

  angular.module('app').controller('GameController', GameController);

  GameController.$inject = ['Positions'];
  function GameController(Positions) {
    var _this = this;

    this.game = {
      id: 1,
      inning: 4,
      isTop: false
    };

    this.homeTeam = {
      name: "The Bulls",
      runs: 0,
      players: [],
      addPlayer: function addPlayer(player) {}
    };

    this.awayTeam = {
      name: "The Storm",
      runs: 0,
      players: [],
      addPlayer: function addPlayer(player) {}
    };

    var t1 = [8, 7, 3, 18, 33, 59, 42, 22, 27, 16, 19, 34];
    var t2 = [2, 11, 18, 23, 44, 46, 1, 3, 9, 18, 25, 53];

    this.getPlayerClass = function (player) {
      var atBat = _this.isTop && player.team === _this.homeTeam;
    };
  }
})();
'use strict';

(function () {
  'use strict';

  angular.module('resources', ['js-data']).config(["DSFirebaseAdapterProvider", function (DSFirebaseAdapterProvider) {
    DSFirebaseAdapterProvider.defaults.basePath = 'https://bcw-bcc.firebaseio.com/';
  }]).run(["DS", "DSFirebaseAdapter", function (DS, DSFirebaseAdapter) {

    // the firebase adapter was already registered
    DS.adapters.firebase === DSFirebaseAdapter;

    // but we want to make it the default
    DS.registerAdapter('firebase', DSFirebaseAdapter, { default: true });
  }]).factory('Game', ["DS", function (DS) {
    return DS.defineResource('Game');
  }]);
})();
'use strict';

(function () {
  'use strict';

  RosterController.$inject = ["Positions"];
  angular.module('app').directive('roster', Roster);

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
    var _this = this;

    this.positions = Positions;

    this.updatePosition = function (player) {

      if (player.position !== _this.positions.bench) {
        _this.team.players.filter(function (x) {
          return x !== player && x.position == player.position;
        }).forEach(function (x) {
          return x.position = _this.positions.bench;
        });
      }
    };

    //this.availablePositions = () => {
    //positions.filter(x => !x || this.team.players.some(p => p.position === x));
    //}
  }
})();