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
    //moment.tz.add('America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0');
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


  /**
  This function's pretty cool imo. It's nothing special, though.
  It's just grabbing the last-queued song's start time and duration then
  it adds them together to output a estimated start-time of the newly
  requested song. Also posts the new song with its' duration.

  Also, to those who noticed... Yes, this means this will only work properly
  in one timezone. My timezone. This is just testing the concept. If this
  function is still in the repo, that means I'm still testing/messing around
  with things. Don't open an issue, and more importantly, don't dm me
  on Twitter. I don't care.
  **/

  $scope.create = function(id, obj) {
    getPrevious(function(data) {

      var startTime = moment(data[0].start_time).add(data[0].minutes, 'm').add(
        data[0].seconds, 's'
      ).zone("+05:00").format();

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
