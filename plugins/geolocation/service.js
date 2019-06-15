(function () {
	'use strict';
	/*
     var position = {
     latitude: 78.23423423,
     longitude: 13.123124142
     }
     deferred.resolve(position);
     */
	function GeolocationService($q, $rootScope, $window, $http) {

		var service = {};
		var geoloc = null;

		service.getLocation = function (parms) {
			var deferred = $q.defer();
			// Use geo postion from config file if it is defined
			if (typeof config.geoPosition != 'undefined'
                && typeof config.geoPosition.latitude != 'undefined'
                && typeof config.geoPosition.longitude != 'undefined') {
				deferred.resolve({
					coords: {
						latitude: config.geoPosition.latitude,
						longitude: config.geoPosition.longitude,
					},
				});
			} else {
				// Get geolocation to https://geoip-db.com
				const https = require('https')
				const https_params = {
					  hostname: 'geoip-db.com',
					  port: 443,
					  path: '/json/',
					  method: 'GET',
				}

				const req = https.request(https_params, (res) => {
					res.on('data', (req) => {
						var info = JSON.parse(req);
						console.log("latitude : " + info.latitude + " / longitude : " + info.longitude);
						deferred.resolve({ 'coords': { 'latitude': info.latitude, 'longitude': info.longitude } })

					})
					req.on('error', (error) => {
						console.error(error)
					})
				})

				req.end()


			}
			geoloc = deferred.promise;
			return geoloc;
		}
		return service;
	}
	angular.module('SmartMirror')
		.factory('GeolocationService', GeolocationService);
} ());
