Intern.controller('PlayerController', PlayerController);

function PlayerController($scope, $http, PlayerService, SongService) {
  start();

  function start() {
    $scope.youtube = PlayerService.getTube();
    $scope.pList = true;
  }

  $scope.init = function() {
    SongService.archiveList().success(function(data) {
      $scope.archiveList = data;
    });
  }

  $scope.launch = function(id) {
    PlayerService.launch(id);
    PlayerService.delete($scope.queueList, id);
  };

  $scope.queue = function(id) {
    PlayerService.queue(id);
  };

  $scope.create = function(song) {
    SongService.create({song:song});
  }

  function getList() {
    SongService.list().success(function(data) {
      return data;
    });
  }
}
