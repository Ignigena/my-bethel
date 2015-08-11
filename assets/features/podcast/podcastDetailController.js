angular.module('Bethel.podcast')
.run(function() {
  Chart.defaults.global.colours[0] = '#455a64';
})
.controller('podcastDetailController', ['$scope', '$state', '$stateParams', 'upload', '$mdDialog', 'sailsSocket',
  function ($scope, $state, $stateParams, upload, $mdDialog, sailsSocket) {

  var $ctrl = this;
  $scope.id = $stateParams.podcastId;
  $scope.uploading = false;
  $scope.uploadProgress = 0;
  $scope.editing = false;
  $scope.subscriberCount = 0;
  $scope.subscriberChange = 0;

  $scope.subscriberChart = {
    data: [[]],
    labels: [],
    options: {
      scaleShowVerticalLines: false,
      pointHitDetectionRadius: 5
    }
  };

  $scope.init = function() {
    sailsSocket.get('/podcast/edit/' + $scope.id).then(function (data) {
      $scope.podcast = data.podcast;
      $scope.thumbnailS3 = data.s3form;
      $scope.thumbnailUploading = false;
      $scope.uploadEpisode = data.uploadEpisode;
    });

    $scope.podcastStats = sailsSocket.populateOne('podcast/subscribers/' + $scope.id);
  };

  $scope.init();

  sailsSocket.editable($scope, 'podcast', ['name', 'service', 'sourceMeta', 'tags', 'description']);

  io.socket.on('podcast', function (message) {
    if (message.verb !== 'updated' || message.id !== $scope.podcast.id)
      return;
    $scope.init();
  });

  $ctrl.populateDemo = function() {
    $scope.isDemo = ($scope.subscriberCount < 1);
    if (!$scope.isDemo) return;
    for (var i = 0; i < 10; i++) {
      $scope.subscriberChart.data[0].push(Math.round((i * 10) + (Math.random() * 30)));
      $scope.subscriberChart.labels.push(moment().subtract(10 - i, 'weeks').format('MMM D'));
    }
    $scope.subscriberCount = $scope.subscriberChart.data[0].slice(-1)[0];
    $scope.subscriberCompare = $scope.subscriberChart.data[0].slice(-2)[0]
    $scope.subscriberChange = (($scope.subscriberCount - $scope.subscriberCompare) / $scope.subscriberCompare) * 100;
  };

  $scope.$watch('podcastStats', function (newValue) {
    if (!newValue || !newValue.historical) return;
    $scope.subscriberChart.data[0] = [];
    $scope.subscriberChart.labels = [];
    angular.forEach(newValue.historical, function (subscribers, week) {
      $scope.subscriberChart.data[0].push(subscribers);
      $scope.subscriberChart.labels.push(moment(String(week), 'YYYYw').format('MMM D'));
    });
    $scope.subscriberCount = $scope.subscriberChart.data[0].slice(-2)[0] || 0;
    $scope.subscriberCompare = $scope.subscriberChart.data[0].slice(-3)[0];
    $scope.subscriberChange = (($scope.subscriberCount - $scope.subscriberCompare) / $scope.subscriberCompare) * 100;

    $ctrl.populateDemo();
  }, true);

  $scope.uploadThumbnail = function($files) {
    $scope.thumbnailUploading = true;

    upload.s3($scope.thumbnailS3, $files[0])
      .success(function (data, status, headers, config) {
        sailsSocket.put('/podcast/' + $scope.id, {
          id: $scope.id,
          temporaryImage: $files[0].name
        });
      });
  };

  // Triggered when a file is chosen for upload.
  // On supported browsers, multiple files may be chosen.
  $scope.onFileSelect = function($files) {
    for (var i = 0; i < $files.length; i++) {
      $scope.createPodcastMedia($files[i]);
    }
  };

  $scope.createPodcastMedia = function(file) {

    var fileExt = file.name.split('.').pop(),
        fileName = file.name.replace('.' + fileExt, '');

    $scope.uploading = true;

    upload.s3($scope.uploadEpisode, file)
      .progress(function(evt) {
        $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
      })
      .success(function(data, status, headers, config) {

        sailsSocket.post('/podcastmedia', {
          name: fileName,
          date: file.lastModifiedDate,
          url: 'http://cloud.bethel.io/' + $scope.uploadEpisode.bucket + '/' + encodeURI(file.name),
          size: file.size,
          podcast: $scope.id,
          type: 'cloud'
        }).then(function (podcast) {
          // Call the endpoint to generate metadata.
          sailsSocket.get('/podcastmedia/meta/' + podcast.id);
          $scope.init();
          $scope.uploading = false;
        });

      });
  };

  $scope.editMedia = function(event, id) {
    $mdDialog.show({
      clickOutsideToClose: true,
      templateUrl: 'features/podcast/podcastMediaView.html',
      targetEvent: event,
      locals: { mediaId: id },
      controller: 'podcastMediaController'
    });
  };

  $scope.submitPodcast = function(event) {
    $mdDialog.show({
      clickOutsideToClose: true,
      templateUrl: 'features/podcast/podcastSubmitView.html',
      targetEvent: event,
      locals: { id: $scope.id },
      controller: function submitPodcastDialog($scope, id) {
        $scope.feed = 'http://podcast.bethel.io/' + id + '.xml';
      }
    });
  };

}]);
