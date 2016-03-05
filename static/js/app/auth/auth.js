Intern.controller('AuthController', AuthController);
AuthController.inject = ['$cookies'];

function AuthController($scope, $cookies, AuthService) {

  $scope.register = function(email, username, password) {
    AuthService.register(email, username, password);
  }
  $scope.login = function(username, password) {
    AuthService.login(username, password);
  }
  AuthService.checkAuth('carter').success(function(data) {
    var data = data[0];
    $scope.user = data.username;
    $scope.threads = data.threads;
  });
}
