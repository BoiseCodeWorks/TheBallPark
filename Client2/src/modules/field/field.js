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


