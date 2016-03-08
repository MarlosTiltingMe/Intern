Intern.controller('PlayerController', PlayerController);

function PlayerController($scope, $http, PlayerService, SongService) {
  start();

  function start() {
    $scope.youtube = PlayerService.getTube();
    $scope.queueList = PlayerService.getQueue();
    $scope.pList = true;
  }

  $scope.launch = function(id) {
    PlayerService.launch(id);
    PlayerService.delete($scope.queueList, id);
  };

  $scope.queue = function(id) {
    PlayerService.queue(id);
  };


  $scope.postWhenNone = function() {
    if(YT.PlayerState.ENDED) {
      console.log('test');
      reset();
    }
  }

  $scope.create = function(song) {
    SongService.create({song:song}).then(a, b);

    function a(data, status, headers, confg) {
      $scope.postWhenNone();
    }

    function b(data, status, headers, config) {
      console.log(data);
    }
  }

  function getList() {
    SongService.list().success(function(data) {
      return data;
    });
  }
}
