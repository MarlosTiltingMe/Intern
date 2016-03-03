Intern.controller('HomeController', HomeController);

function HomeController($scope, ThreadsService) {
  ThreadsService.list().success(function(data) {
    $scope.threadList = data;
  });
}
