angular.module('Bethel.podcast')

.controller('podcastWizardController', function ($scope, $mdDialog) {

  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

});