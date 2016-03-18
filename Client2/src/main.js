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