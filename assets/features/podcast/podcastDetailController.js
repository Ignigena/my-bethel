angular.module('Bethel.podcast')
.controller('podcastDetailController', ['$scope', '$state', '$stateParams', 'upload', '$mdDialog', 'sailsSocket',
  function ($scope, $state, $stateParams, upload, $mdDialog, sailsSocket) {

  var titleEditor, descriptionEditor;
  $scope.id = $stateParams.podcastId;
  $scope.uploading = false;
  $scope.uploadProgress = 0;
  $scope.editing = false;

  $scope.init = function() {

    sailsSocket.get('/podcast/' + $scope.id).then(function (data) {
      $scope.podcast = data;
      $scope.thumbnailUploading = false;
    });

    sailsSocket.get('/podcast/edit/' + $scope.id).then(function (data) {
      $scope.thumbnailS3 = data.s3form;
      $scope.uploadEpisode = data.uploadEpisode;
    });

  };

  $scope.init();

  sailsSocket.get('/service/list').then(function (data) {
    $scope.accounts = data;
  });

  io.socket.on('podcast', function (message) {
    if (message.verb === 'updated' && message.id === $scope.podcast.id) {
      $scope.init();
    }
  });

  $scope.$watch('podcast', function (newValue, oldValue) {
    if (!newValue || !oldValue) return;

    sailsSocket.put('/podcast/' + $scope.id, {
      name: newValue.name,
      service: newValue.service,
      sourceMeta: newValue.sourceMeta,
      tags: newValue.tags,
      description: newValue.description,
    });
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
  $scope.onFileSelect = function ($files) {
    for (var i = 0; i < $files.length; i++) {
      $scope.createPodcastMedia($files[i]);
    }
  };

  $scope.createPodcastMedia = function (file) {

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
          url: 'http://cloud.bethel.io/' + encodeURI(fileMeta.key),
          size: file.size,
          podcast: $scope.id,
          type: 'cloud'
        }).then(function (podcast) {
          // Call the endpoint to generate metadata.
          sailsSocket.get('/podcastmedia/meta/' + podcast.id);
          $scope.init();
        });

      });
  };

  $scope.editMedia = function (id) {
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
