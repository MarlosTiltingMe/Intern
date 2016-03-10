Intern.controller('AuthController', AuthController);
AuthController.inject = ['$cookies'];

function AuthController($scope, $cookies, AuthService) {

  $scope.register = function(email, username, password) {
    AuthService.register(email, username, password);
  }
  $scope.login = function(username, password) {
    AuthService.login(username, password);
  }
  $scope.logout = function() {
    AuthService.logout();
  }
  $scope.isAuthenticated = function() {
    return AuthService.isAuthenticated();
  }

  $scope.userModel = AuthService.getAuthenticatedAccount();

}