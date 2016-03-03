Intern.controller('ProfileController', ProfileController);

function ProfileController($scope, BoardsService) {
  BoardsService.list().success(function(data) {
    $scope.boardList = data;
  });
}
