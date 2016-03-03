Intern.config(function($routeProvider) {
  var app = 'static/js/app/';

  $routeProvider
  .when('/', {
    controller: 'HomeController',
    controllerAs: 'HomeCtrl',
    templateUrl: app + 'home/home.tpl.html'
  }).when('/login', {
    controller: 'LoginController',
    controllerAs: 'LoginCtrl',
    templateUrl: app + 'login/login.tpl.html'
  });
});
