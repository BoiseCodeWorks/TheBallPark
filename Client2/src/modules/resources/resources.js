(function() {
  'use strict';

  angular
    .module('resources', ['js-data'])
    .config(function(DSFirebaseAdapterProvider) {
      DSFirebaseAdapterProvider.defaults.basePath = 'https://bcw-bcc.firebaseio.com/';
    }).run(function(DS, DSFirebaseAdapter) {

      // the firebase adapter was already registered
      DS.adapters.firebase === DSFirebaseAdapter;

      // but we want to make it the default
      DS.registerAdapter('firebase', DSFirebaseAdapter, { default: true });
    }).factory('Game', (DS) => {
      return DS.defineResource('Game');
    })
})();
