var Intern = angular.module('Intern', ['ngRoute', 'ngCookies']).run(run);

function run($http) {
  $http.defaults.xsrfHeaderName = 'X-CSRFToken';
  $http.defaults.xsrfCookieName = 'csrftoken';
}
