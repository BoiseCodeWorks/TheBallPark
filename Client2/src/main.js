(function() {
  'use strict';

  angular.module('app', ['resources'])
    .constant('Positions', (function() {
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
      }
    })())
})();
