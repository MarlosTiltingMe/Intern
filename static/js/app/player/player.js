Intern.controller('PlayerController', PlayerController);

function PlayerController($scope, $http, PlayerService, SongService, UserService,
  $interval) {

    var obj = {};

    $scope.isMuted = false;
    function curVol() {
      return $scope.youtube.player.getVolume();
    }

    $scope.getQueue = function(){
      $interval(function() {
        SongService.list().success(function(data) {
          $scope.queueList = data;
        });
      }, 5000);
    }


    $scope.timer = function() {
      $interval(function() {
        var totalTime = $scope.youtube.duration;
        var curTime = Math.round($scope.youtube.curTime);
        var timeDifference = (curTime / totalTime) * 100;
        $scope.prog = Math.round(timeDifference);
        $scope.$apply;
      }, 1500);
    }

    $scope.mute = function() {
      if (!$scope.isMuted) {
        $scope.isMuted = !$scope.isMuted;
        $scope.youtube.player.mute();
      }
    }

    $scope.unmute = function() {
      if ($scope.isMuted) {
        $scope.isMuted = !$scope.isMuted;
        $scope.youtube.player.unMute();
      }
    }

    $scope.volDown = function() {
      var newVol = curVol() - 10;
      $scope.youtube.player.setVolume(newVol);
    }

    $scope.volUp = function() {
      var newVol = curVol() + 10;
      $scope.youtube.player.setVolume(newVol);
    }

    $scope.$on("get_title", function(event, args) {
      getList(function(data) {
        $scope.title = data[0].title;
        $scope.requester = data[0].requester;
        $scope.minutes = data[0].minutes;
        $scope.seconds = data[0].seconds;
        $scope.$apply;
      });
    });

    $scope.bindPlayer = function() {
      PlayerService.bindPlayer();
    }

    $scope.init = function() {
      setTimeout(function() {
        PlayerService.checkPlayer();
      }, 1000);
      $scope.newHistory();
      $scope.youtube = PlayerService.getTube();
      $scope.pList = true;
      idToName();
    }

    $scope.calculateDur = function(id) {

        var x = id;
        if (x.indexOf('youtube') > -1) {
            alert('Only request the song id(all text after watch?v=).');
            return false;
        } else {
            var key = 'AIzaSyDA3GC_BnCeIcWgQ74FTCdOjjA5HCrGz-U';

            var perId = 'https://www.googleapis.com/youtube/v3/videos?'
            + 'part=snippet&id=' + id + '&key=' + key;

            var url = 'https://www.googleapis.com/youtube/v3/videos?id=' + id +
                '&part=contentDetails&key=' + key;

            $http.get(url).success(function(data) {

                var parsedTime = data.items[0].contentDetails.duration.split('PT')[1];
                obj.minutes = parsedTime.split('M');

                if (obj.minutes[1].indexOf('S') > -1) {
                  obj.seconds = obj.minutes[1].split('S')[0];
                } else {
                  obj.seconds = '1';
                }

                $http.get(perId).success(function(resp) {
                  obj.title = resp.items[0].snippet.title;
                  $scope.create(id, obj);
                });
            });

        }
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
            if (callback) callback(data);
        }
    }

    $scope.newHistory = function() {
      SongService.list().success(function(data) {
        $scope.queueList = data;
        $scope.getQueue();
      });
    }


    $scope.create = function(id, obj) {
        getPrevious(function(data) {
          var startTime = moment(); //temporary

            $http.get('/api/current/').success(function(data) {

              //If request doesn't fail, archives song as well as queues.
              SongService.create({
                  song: id,
                  minutes: obj.minutes[0],
                  seconds: obj.seconds,
                  start_time: startTime,
                  title: obj.title,
                  requester: data.id
              }).success(function(resp) {
                alert('Song requested.');
              });
            });
        });
    }

    $scope.hmap = new Map();

    function idToName() {
        UserService.list().success(function(data) {
            for (var c = 0; c < data.length; c++) {
                var key = data[c].id;
                $scope.hmap.set(key, data[c].id);
                $scope.hmap.set(key, data[c].username);
            }
        });
    }

    $scope.map = function(key) {
      return $scope.hmap.get(key);
    }

    $scope.getFMap = function(key) {
      //console.log($scope.fMap);
      return $scope.fMap.get(key);
    }

    function getList(callback) {
        SongService.list().success(function(data) {
            if (callback) callback(data);
            return data;
        });
    }
}
