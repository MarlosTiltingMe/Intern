Intern.controller('PlayerController', PlayerController);

function PlayerController($scope, $http, PlayerService, SongService, UserService) {
  start();

  var obj = {};

  function start() {
    $scope.youtube = PlayerService.getTube();
    $scope.pList = true;
  }

  $scope.init = function() {
    SongService.archiveList().success(function(data) {
      $scope.archiveList = data;
      idToName();
    });
    moment.tz.add('America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0');
  }

  $scope.calculateDur = function(id) {
    console.log('calc dir');
    var key = 'AIzaSyBozEtHPwS2fZz3aVpZlaDPeXIzHQeJo7k';
    var url = 'https://www.googleapis.com/youtube/v3/videos?id=' + id +
    '&part=contentDetails&key=' + key;

    $http.get(url).success(function(data) {

      var parsedTime = data.items[0].contentDetails.duration.split('PT')[1];
      obj.minutes = parsedTime.split('M');
      obj.seconds = obj.minutes[1].split('S')[0];

      $scope.create(id, obj);
    });
  }

  $scope.launch = function(id) {
    PlayerService.launch(id);
    PlayerService.delete($scope.queueList, id);
  };

  $scope.queue = function(id) {
    PlayerService.queue(id);
  };

  function getPrevious(callback) {

    getList(go);
    function go(data) {
      if(callback)  callback(data);
    }
  }

  //moment(data[0].end_time).add(4, 'm').format()

  $scope.create = function(id, obj) {

    getPrevious(function(data) {
      console.log(data[0].start_time);

      var startTime = moment(data[0].start_time).add(data[0].minutes, 'm').add(
        data[0].seconds, 's'
      ).format();

      test = moment(startTime).zone("+05:00");

      console.log(test);
      SongService.create({song:id, minutes:obj.minutes[0], seconds:obj.seconds,
        start_time: startTime
      });
    });
  }

  $scope.hmap = new Map();

  function idToName() {
    UserService.list().success(function(data) {
      for(var c = 0; c < data.length; c++) {
        var key = data[c].id;
        $scope.hmap.set(key, data[c].id);
        $scope.hmap.set(key, data[c].username);
      }
    });
  }

  $scope.map = function(key) {
    return $scope.hmap.get(key);
  }

  function getList(callback) {
    SongService.list().success(function(data) {
      if(callback)  callback(data);
      return data;
    });
  }
}
