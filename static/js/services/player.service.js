Intern.service('PlayerService', PlayerService);

Intern.config( function ($httpProvider) {
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

function PlayerService($window, $http, $rootScope, SongService) {

    var service = this;

    var tube = {
      autoplay: 1,
      ready: false,
      height: '360',
      width: '100%',
      state: 'stopped',
      player: null,
      videoId: null,
      id: '',
      playerId: null,
      state: 'stopped',
      current: 0
    };


    var thanesIdea = [];
    var graveyard = [];

    var songAmount = 0;

    function getSongs(callback) {
      return SongService.list().success(function(response) {
        for(var c = 0; c < 1; c++) { //ha
          thanesIdea.splice(c, 0, response[c]);
        }
        if(callback)  callback();
      });
    }

    function destroy() {
      SongService.destroy(thanesIdea, 1, reset);
    }

    function reset(callback) {
      if(tube.current > 0) {
        tube.current = 0;
        destroy();
      } else {
        getSongs(replay);
      }
    }

    $window.onYouTubeIframeAPIReady = function() {
      tube.ready = true;
      service.bind('player');
      service.load();
      $rootScope.$apply();
    }

    function replay() {
      service.launch(thanesIdea[tube.current].song);
      tube.current = tube.current + 1;
    }

    function onTubeReady(event) {
      getSongs(ready);
      function ready() {
        tube.player.cueVideoById(thanesIdea[tube.current].song);
        tube.player.playVideo();
        //tube.current = tube.current + 1;
        getSongs(replay);
      }
    }

    function checkQueue(callback) {
      SongService.list().success(function(data) {
        if(data.length > 1) {
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

    function onTubeError(event) {
      reset();
    }

    this.launch = function(id) {
        tube.player.loadVideoById(id);
        tube.id = id;
        return tube;
    }

    this.bind = function(elementId) {
        tube.playerId = elementId;
    };

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

    this.load = function() {
        if (tube.ready && tube.playerId) {
            if (tube.player) {
                tube.player.destroy();
            }
            tube.player = service.spawnPlayer();
        }
    };

    this.queue = function(id) {
        queued.push({
            id: id
        });
        return queued;
    }

    this.getTube = function() {
        return tube;
    }

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
