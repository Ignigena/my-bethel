angular.module('Bethel.user', ['uiGmapgoogle-maps'])
.config(['$stateProvider', 'uiGmapGoogleMapApiProvider',
  function ($stateProvider, uiGmapGoogleMapApiProvider) {

  $stateProvider
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'features/user/userDashboardView.html'
    })
    .state('settings', {
      url: '/settings',
      templateUrl: 'features/user/userSettingsView.html',
      controller: 'userSettingsController'
    });

  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyCasoNnO-7ZHrH_NBcCU_BBed6duq8NvJg',
    v: '3.17',
    libraries: 'places'
  });

}]);
