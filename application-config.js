(function(annyang) {
  'use strict';

  function ConfigService($http) {
    var service = {};
    service.configuration = {};

    service.initialize = function() {
      var defaultConfig = require('./config.default.js');
      var config = require('./config.js');

      _mergeRecursive(config, defaultConfig);
      service.configuration = config;
    };

    var _mergeRecursive = function(obj1, obj2) {

      //iterate over all the properties in the object which is being consumed
      for (var p in obj2) {
        // Property in destination object set; update its value.
        if ( obj2.hasOwnProperty(p) && typeof obj1[p] !== "undefined" ) {
          _mergeRecursive(obj1[p], obj2[p]);

        } else {
          //We don't have that level in the hierarchy so add it
          obj1[p] = obj2[p];

        }
      }
    };

    service.getConfiguration = function() {
      return service.configuration;
    };

    return service;
  }

  angular.module('SmartMirror')
  .factory('ConfigService', ConfigService);
}(window.annyang));
