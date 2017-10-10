function HADisplay($scope, $http, $interval, SpeechService) {

	function getHADisplays() {
		$scope.hadisplay = [];

		if (config.hadisplay && config.hadisplay.commands && config.hadisplay.commands.length >= 1) {
			angular.forEach(config.hadisplay.commands, function (command) {

				var req = {
					data : {},
					method: 'POST',
					headers: {
						'x-ha-access' : config.hadisplay.key,
						'content-type' : 'application/json'
					},
					url: config.hadisplay.url + '/api/template',
				}
				try{
					// be careful not to use double quoats (unless they are escaped)
					req.data.template = command.template
				} catch(e) {
					// no data - that's fine
				}
				
				$http(req).then(function(response) { 
					console.log('Executed HA Template:', command.heading) 
					$scope.hadisplay.push(angular.fromJson('{ "result": { "heading": "' + command.heading + '", "data": "' + response.data + '" } }'));
				}, 
				function errorCallback(response) {
					console.error('HA API Call failed:', response) 
				});
			});
		}
	}
	getHADisplays();
	$interval(getHADisplays,(config.hadisplay ? config.hadisplay.refreshInterval * 60000 : 300000));

	SpeechService.addCommand('netflix_chill', function (img) {
		var req = {
			method: 'POST',
			url: config.hadisplay.url + '/api/services/scene/turn_on',
			headers: {
				'x-ha-access' : config.hadisplay.key,
				'content-type' : 'application/json'
			},
			data: {"entity_id": "scene.netflix_and_chill"}
		}

		$http(req).then(function(response) { 
			$scope.greeting = "Chill :)";
		})
	});
}

angular.module('SmartMirror')
    .controller('HADisplay', HADisplay);

