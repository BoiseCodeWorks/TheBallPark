(() => {
  'use strict';
  var baseUrl = window.location.hostname === "localhost" ? "http://localhost:63801" : "http://api.boisecodeworks.com/";
  angular
    .module('resources', ['js-data'])
    .config((DSHttpAdapterProvider, DSFirebaseAdapterProvider) => {
      DSHttpAdapterProvider.defaults.basePath = baseUrl + "/api";
      DSFirebaseAdapterProvider.defaults.basePath = 'https://bcw-bcc.firebaseio.com/';
    }).run((DS, DSFirebaseAdapter) => {

      // the firebase adapter was already registered
      DS.adapters.firebase === DSFirebaseAdapter;
      // but we want to make it the default
      //DS.registerAdapter('firebase', DSFirebaseAdapter, { default: true });
    }).factory('Uow', (Games, Teams, Players) => {
      return {
        Games: Games,
        Teams: Teams,
        Players: Players
      }
    }).factory('Games', (DS) => {
      return DS.defineResource({
        name: 'game',
        endpoint: 'games',
        computed: {
          players: {
            get: () => {
              return [].concat(this.homeTeam.players).concat(this.awayTeam.players);
            }
          }
        },
        relations: {
          hasOne: {
            team: [
              {
                localKey: 'awayTeamId',
                localField: 'awayTeam'
              }, {
                localKey: 'homeTeamId',
                localField: 'homeTeam'
              }
            ]
          }
        }
      });
    }).factory('Teams', (DS) => {
      return DS.defineResource({
        name: 'team',
        endpoint: 'teams',
        relations: {
          hasMany: {
            player: {
              foreignKey: 'teamId',
              localField: 'players'
            }
          }
        }
      });
    }).factory('Players', (DS) => {
      var store = DS.defineResource({
        name: 'player',
        endpoint: 'players',
        defaultAdapter: 'firebase',
        findStrategy:'fallback',
        findAllStrategy:'fallback',
        fallbackAdapters: ['http'],
        relations: {
          hasOne: {
            team: {
              localKey: 'teamId',
              localField: 'team'
            }
          }
        },
        saveAll: () => {
          store.getAll().filter(x => x.DSHasChanges()).forEach(x => x.DSSave());
        }
      });

      return store;
    })
})();