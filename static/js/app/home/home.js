Intern.controller('HomeController', HomeController);

function HomeController($scope, ThreadsService) {
  $scope.user = AuthService;
  ThreadsService.list().success(function(data) {
    $scope.threadList = data;
  });
}
