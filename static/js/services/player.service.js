Intern.service('PlayerService', PlayerService);

Intern.config( function ($httpProvider) {
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

function PlayerService($window, $http, $rootScope, SongService) {

    var service = this;

    var tube = {
      ready: false,
      height: '360',
      width: '100%',
      state: 'stopped',
      player: null,
      videoId: null,
      id: null,
      playerId: null,
      state: 'stopped',
      current: 0,
      entries: 1 //How many songs are queued up at once.
    };

    //Array that at one point or another will hold all songs.
    var thanesIdea = [];

    /**
    Checks the song endpoint, pushes(splices) songs into array, and callsback.
    **/
    function getSongs(callback) {
      return SongService.list().success(function(response) {
        for(var c = 0; c < tube.entries; c++) { //ha
          thanesIdea.splice(c, 0, response[c]);
        }
        if(callback)  callback();
      });
    }

    //Destroys each object in the array's REST object, then calls reset();.
    function destroy() {
      SongService.destroy(thanesIdea, tube.entries, reset);
    }

    //Checks current song position. If it's > tube.entries.
    //if it is, set current to 0 and destroy. If not,
    //Queue up more songs and callback to replay();
    function reset(callback) {
      if(tube.current > tube.entries) {
        tube.current = 0;
        destroy();
      } else {
        getSongs(replay);
      }
    }

    //Player is ready
    $window.onYouTubeIframeAPIReady = function() {
      tube.ready = true;
      service.bind('player');
      service.load();
      $rootScope.$apply();
    }

    //Launchs a new song and counts current pos up.
    function replay() {
      service.launch(thanesIdea[tube.current].song);
      tube.current = tube.current + 1;
    }

    //Event bus
    function onTubeReady(event) {
      getSongs(ready);
      function ready() {
        tube.player.cueVideoById(thanesIdea[tube.current].song);
        tube.player.playVideo();
        checkQueue(getSongs);
      }
    }

    /**
    Grabs Song list. If there's more than data.entries
    it callsback. Since that means there's another user-requested
    song to play.
    If not, it destroys the last played song(if it was user requested),
    and calls back to playArchived();. playArchived() is a function
    that basically will play a random song from the archived list
    if there are no user-requested songs.
    **/
    function checkQueue(callback) {
      SongService.list().success(function(data) {
        if(data.length > data.entries + 1) {
          if(callback)  callback();
        } else {
          SongService.destroy(thanesIdea, 1, playArchived);
          function playArchived() {
            return SongService.archiveList().success(function(data) {
              thanesIdea.splice(0, 0, data[Math.floor(Math.random() * data.length - 1) + 1]);
              service.launch(thanesIdea[0].song);
              tube.current = tube.current + 1;
            });
          }
        }
      });
    }

    //Straight forward. Checks states, if a song ended, check queue
    //and callback to reset.
    function onTubeStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING) {
          tube.state = 'playing';
        } else if (event.data == YT.PlayerState.PAUSED) {
            tube.player.playVideo();
        } else if (event.data == YT.PlayerState.ENDED) {
            tube.state = 'ended';
            checkQueue(reset);
        }
        $rootScope.$apply();
    }

    //Resets if an error occurs.
    function onTubeError(event) {
      checkQueue(reset);
    }

    //launches player with given song id.
    this.launch = function(id) {
        tube.player.loadVideoById(id);
        tube.id = id;
        return tube;
    }

    //binds player to element.
    this.bind = function(elementId) {
        tube.playerId = elementId;
    };

    //Spawns the player.
    this.spawnPlayer = function() {
        return new YT.Player(tube.playerId, {
            height: tube.height,
            width: tube.width,
            vars: {
                rel: 0,
                showinfo: 0,
                autoplay: 1
            },
            events: {
                'onReady': onTubeReady,
                'onStateChange': onTubeStateChange,
                'onError': onTubeError
            }
        });
    };

    //Loads the player.
    this.load = function() {
        if (tube.ready && tube.playerId) {
            if (tube.player) {
                tube.player.destroy();
            }
            tube.player = service.spawnPlayer();
        }
    };

    //Queue function that I'm pretty sure I stopped using.
    //Might come in handy so keeping it.
    this.queue = function(id) {
        queued.push({
            id: id
        });
        return queued;
    }

    this.getTube = function() {
      return tube;
    }
    //Key binds. down mutes client. up unmutes.
    document.onkeydown = function(e) {
      e = e || window.event;
      switch(e.which || e.keyCode) {
        case 40: //down
        tube.player.mute();
        break;

        case 38: //up
        tube.player.unMute();
        break;
      }
    }
}
