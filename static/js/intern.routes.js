Intern.config(function($routeProvider) {
  var app = 'static/js/app/';

  $routeProvider
  .when('/', {
    controller: 'HomeController',
    controllerAs: 'HomeCtrl',
    templateUrl: app + 'home/home.tpl.html'
  }).when('/auth', {
    controller: 'AuthController',
    controllerAs: 'AuthCtrl',
    templateUrl: app + 'auth/auth.tpl.html'
  }).when('/member', {
    controller: 'ProfileController',
    controllerAs: 'ProfileCtrl',
    templateUrl: app + 'profile/profile.tpl.html'
  }).when('/login', {
    controller: 'AuthController',
    controllerAs: 'AuthCtrl',
    templateUrl: app + 'auth/login.tpl.html'
  });
});
