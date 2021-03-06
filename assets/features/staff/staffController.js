angular.module('Bethel.staff')

.controller('staffController', ['$rootScope', '$scope', '$location',
  function ($rootScope, $scope, $location) {

  var $ctrl = this;

  $rootScope.$watch('isAdmin', function() {
    if (typeof $rootScope.isAdmin !== 'undefined' && $rootScope.isAdmin === false) {
      $location.path('/').replace();
    }
  });

  $ctrl.init = function () {
    if ($location.path() === '/staff') {
      $location.path('/staff/user').replace();
    }
  };

  $ctrl.init();

}]);


