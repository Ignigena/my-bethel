'use strict';

/**
 * The main Sails Angular app module
 *
 * @type {angular.Module}
 */
var app = angular.module('app', [
  'sails.io',
  'ui.router',
  'google-maps'
]);

app.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/dashboard');

  $stateProvider
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'templates/dashboard/dashboard.html',
      controller: 'DashboardController'
    })
    .state('dashboard.location', {
      url: '/locations',
      templateUrl: 'templates/dashboard/locations.html',
      controller: 'LocationController'
    })
    .state('dashboard.billing', {
      url: '/billing',
      templateUrl: 'templates/dashboard/billing.html'
    })
    .state('dashboard.accounts', {
      url: '/accounts',
      templateUrl: 'templates/dashboard/accounts.html',
      controller: 'AccountsController'
    });

});

function findIndexByPropertyValue(arr, property, value) {
  var index = null;
  for (var i in arr) {
    if (arr[i][property] == value) {
      index = i;
      break;
    }
  }
  return index;
}
