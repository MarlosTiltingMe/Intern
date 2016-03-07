Intern.service('PlayerService', PlayerService);

Intern.config( function ($httpProvider) {
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

function PlayerService($window, $rootScope, SongService) {

    var service = this;

    var tube = {
      autoplay: 1,
      ready: false,
      height: '720',
      width: '1280',
      state: 'stopped',
      player: null,
      videoId: null,
      id: null,
      playerId: null,
      state: 'stopped',
      songAmount: null
    };

    function getSong(callback) {
      return SongService.list().success(function(response) {
        var newSong = response[0].song;
        tube.songAmount = response.length;
        tube.id = newSong;
        if(callback) {
          callback();
        }
        console.log(tube.id);
        return newSong;
      });
    }

    function deletePlayed() {
      return SongService.destroy(tube.id);
    }
    $window.onYouTubeIframeAPIReady = function() {
      loadPlayer = function() {
        console.log('testing');
        tube.ready = true;
        service.bind('player');
        service.load();
        $rootScope.$apply();
      }
      getSong(loadPlayer());
    }

    function onTubeReady(event) {
      tube.player.cueVideoById(tube.id);
      tube.player.playVideo();
      tube.id = getSong();
    }

    function onTubeStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING) {
          tube.state = 'playing';
        } else if (event.data == YT.PlayerState.PAUSED) {
            tube.state = 'paused';
        } else if (event.data == YT.PlayerState.ENDED) {
            tube.state = 'ended';
            getSong();
            deletePlayed();
            service.launch(tube.id);
        }
        $rootScope.$apply();
    }

    this.launch = function(id) {
        tube.player.loadVideoById(id);
        tube.id = id;
        return tube;
    }

    this.bind = function(elementId) {
        tube.playerId = elementId;
    };

    this.delete = function (list, id) {
      for (var i = list.length - 1; i >= 0; i--) {
        if (list[i].id === id) {
          list.splice(i, 1);
          break;
        }
      }
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
                'onStateChange': onTubeStateChange
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

    this.songAmount = function() {
      return tube.songAmount;
    }
    this.getTube = function() {
        return tube;
    }

    this.getQueue = function() {
        return queued;
    }
}
