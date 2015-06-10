angular.module('Bethel.podcast')

.controller('podcastDetailController', ['$scope', '$state', '$stateParams', '$upload', '$mdDialog', function ($scope, $state, $stateParams, $upload, $mdDialog) {

  var titleEditor, descriptionEditor;
  $scope.id = $stateParams.podcastId;
  $scope.uploading = false;
  $scope.uploadProgress = 0;
  $scope.editing = false;

  $scope.init = function() {
    io.socket.get('/podcast/' + $scope.id, function (data) {
      $scope.$apply(function() {
        $scope.podcast = data;
      });
    });
  };

  $scope.init();

  io.socket.get('/podcast/edit/' + $scope.id, function (data) {
    $scope.$apply(function() {
      $scope.thumbnailForm = data.s3form;
      $scope.uploadEpisode = data.uploadEpisode;
    });
  });

  io.socket.get('/service/list', {}, function (response, status) {
    $scope.$apply(function() { $scope.accounts = response; });
  });

  io.socket.on('podcast', function (message) {
    if (message.verb === 'updated' && message.id === $scope.podcast.id) {
      $scope.init();
    }
  });

  $scope.toggleEditing = function() {
    $scope.editing = !$scope.editing;
  };

  $scope.$watch('editing', function() {
    if (angular.isUndefined(titleEditor))
      return;

    if ($scope.editing === true) {
      titleEditor.activate();
      descriptionEditor.activate();
    } else {
      titleEditor.deactivate();
      descriptionEditor.deactivate();
    }
  });

  $scope.setSource = function(source) {
    if (angular.isUndefined(source.id))
      return;

    io.socket.put('/podcast/' + $scope.id, {
      service: source.id,
      _csrf: $scope.$root._csrf
    }, function (updated) {
      $scope.$apply(function () {
        $scope.podcast.service = updated.service;
      });
    });
  };

  $scope.updateSource = function(tag, action) {
    switch (action) {
      case 'added':
        if (angular.isUndefined($scope.podcast.sourceMeta) || typeof $scope.podcast.sourceMeta === 'string') {
          $scope.podcast.sourceMeta = [];
        }
        $scope.podcast.sourceMeta.push(tag.text);
        break;

      case 'removed':
        var tagToDelete = $scope.podcast.sourceMeta.indexOf(tag.text);
        if (tagToDelete > -1) {
          $scope.podcast.sourceMeta.splice(tagToDelete, 1);
        }
        break;
    }

    io.socket.put('/podcast/' + $scope.id, {
      sourceMeta: $scope.podcast.sourceMeta,
      _csrf: $scope.$root._csrf
    });
  };

  $scope.uploadThumbnail = function ($files) {
    $scope.thumbnailUploading = true;
    $upload.upload({
      url: $scope.thumbnailForm.action,
      method: 'POST',
      data: {
        key: $scope.thumbnailForm.bucket + '/' + $files[0].name,
        AWSAccessKeyId: $scope.thumbnailForm.key, 
        acl: 'public-read',
        policy: $scope.thumbnailForm.policy,
        signature: $scope.thumbnailForm.signature,
        'Content-Type': $files[0].type !== '' ? $files[0].type : 'application/octet-stream'
      },
      file: $files[0],
    })
    .success(function (data, status, headers, config) {
      io.socket.put('/podcast/' + $scope.id, {
        id: $scope.id,
        temporaryImage: $files[0].name,
        _csrf: $scope.$root._csrf
      });
      $scope.thumbnailUploading = false;
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

    var fileMeta = {
      key: $scope.uploadEpisode.bucket + '/' + file.name,
      AWSAccessKeyId: $scope.uploadEpisode.key,
      acl: 'public-read',
      policy: $scope.uploadEpisode.policy,
      signature: $scope.uploadEpisode.signature,
      'Content-Type': file.type !== '' ? file.type : 'application/octet-stream'
    };

    $scope.uploading = true;

    $upload.upload({
      url: $scope.uploadEpisode.action,
      method: 'POST',
      data: fileMeta,
      file: file,
    })
    .progress(function(evt) {
      $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
    })
    .success(function(data, status, headers, config) {

      io.socket.post('/podcastmedia', {
        name: fileName,
        date: file.lastModifiedDate,
        url: 'http://cloud.bethel.io/' + encodeURI(fileMeta.key),
        size: file.size,
        podcast: $scope.id,
        type: 'cloud',
        _csrf: $scope.$root._csrf
      }, function (podcast) {
        // Call the endpoint to generate metadata.
        io.socket.get('/podcastmedia/meta/' + podcast.id);

        $scope.init();
      });

    });
  };

  $scope.editMedia = function (id) {

    var modalInstance = $modal.open({
      templateUrl: 'features/podcast/podcastMediaView.html',
      controller: 'podcastMediaController',
      resolve: {
        mediaId: function() {
          return id;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function (result) {
      if (result === 'cancel')
        return;

      $scope.init();
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
