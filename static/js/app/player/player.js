Intern.controller('PlayerController', PlayerController);

function PlayerController($scope, $http, PlayerService, SongService, UserService) {
  start();

  function start() {
    $scope.youtube = PlayerService.getTube();
    $scope.pList = true;
  }

  $scope.init = function() {
    SongService.archiveList().success(function(data) {
      $scope.archiveList = data;
      idToName();
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

  $scope.hmap = new Map();

  function idToName() {
    UserService.list().success(function(data) {
      for(var c = 0; c < data.length; c++) {
        var key = data[c].id;
        $scope.hmap.set(key, data[c].id);
        $scope.hmap.set(key, data[c].username);
      }
      console.log($scope.hmap);
    });
  }

  $scope.map = function(key) {
    return $scope.hmap.get(key);
  }

  function getList() {
    SongService.list().success(function(data) {
      return data;
    });
  }
}
