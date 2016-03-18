Intern.controller('PlayerController', PlayerController);

function PlayerController($scope, $http, PlayerService, SongService, UserService) {
    start();

    var obj = {};

    $scope.$on("get_title", function(event, args) {
      getList(function(data) {
        $scope.title = data[0].title;
        $scope.requester = data[0].requester;
        $scope.$apply;
      });
    });

    $scope.$on("get_archived", function(event, args) {
      $scope.title = args.param.title;
      $scope.requester = args.owner.requester;
      $scope.$apply;
    });

    function start() {
        $scope.youtube = PlayerService.getTube();
        $scope.pList = true;
    }

    $scope.init = function() {
        SongService.archiveList().success(function(data) {
            $scope.archiveList = data;
            idToName();
            $scope.$apply;
        });
    }

    $scope.calculateDur = function(id) {

        var x = id;
        if (x.indexOf('youtube') > -1) {
            alert('Only request the song id(all text after watch?v=).');
            return false;
        } else {
            var key = 'AIzaSyBozEtHPwS2fZz3aVpZlaDPeXIzHQeJo7k';
            var perId = 'https://www.googleapis.com/youtube/v3/videos?'
            + 'part=snippet&id=' + id + '&key=' + key;

            var url = 'https://www.googleapis.com/youtube/v3/videos?id=' + id +
                '&part=contentDetails&key=' + key;

            $http.get(url).success(function(data) {

                var parsedTime = data.items[0].contentDetails.duration.split('PT')[1];
                obj.minutes = parsedTime.split('M');
                obj.seconds = obj.minutes[1].split('S')[0];

                $http.get(perId).success(function(resp) {
                  obj.title = resp.items[0].snippet.title;
                  console.log(obj.title);
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
      console.log('new');
      $scope.init();
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

            if (data.length > 0) {
                var startTime = moment(data[0].start_time)
                  .add(data[0].minutes, 'm').add(
                    data[0].seconds, 's'
                ).zone("+05:00").format();
            } else {
                var startTime = moment().zone("+05:00").format();
            }

            $http.get('/api/test/').success(function(data) {
                SongService.archive({
                    song: id,
                    upvotes: 1,
                    requester: data.id,
                    title: obj.title
                });
            });

            SongService.create({
                song: id,
                minutes: obj.minutes[0],
                seconds: obj.seconds,
                start_time: startTime,
                title: obj.title
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

    function getList(callback) {
        SongService.list().success(function(data) {
            if (callback) callback(data);
            return data;
        });
    }
}
