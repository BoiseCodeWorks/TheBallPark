(function() {
  'use strict';

  angular.module('app', [])
  .constant('Positions',(function(){
    return [
      "",
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
