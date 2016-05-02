Intern.service('PlayerService', PlayerService);

Intern.config(function($httpProvider) {
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

function PlayerService($window, $http, $rootScope, SongService, $interval) {

  var service = this;
  var obj = {};

  window.YTConfig = {
    'host': 'https://www.youtube.com'
  };

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
    duration: null,
    curTime: null,
    isBound: null
  };

  var songQueue = {
    id: null,
    song: null,
    minutes: null,
    seconds: null,
    length: null
  };

  service.bindPlayer = function() {
    tube.ready = true;
    service.bind('player');
    service.load();
    $rootScope.apply;
    tube.isBound = true;
  }

  service.checkPlayer = function(call) {
    console.log('Player failed to bind. Binding now. You\'re welcome.');
    service.bindPlayer();
    if(call)  call();
  }

  function deadPlayer(call) {
    check = setInterval(function() {
      SongService.list().success(function(data) {
        if (data.length) {
          songQueue = {
            id:data[0].id,
            song:data[0].song,
            seconds:data[0].seconds,
            minutes:data[0].minutes,
            length:data.length
          }

          $rootScope.$broadcast("get_title");
          ready(songQueue);
          clearInterval(check);
        }
      });
    }, 2000);
    if (call)  call();
  }

  function getSongs(callback) {
    SongService.list().success(function(data) {
      if (data.length) {

        songQueue = {
          id:data[0].id,
          song:data[0].song,
          seconds:data[0].seconds,
          minutes:data[0].minutes,
          length:data.length
        }

        $rootScope.$broadcast("get_title");
        ready(songQueue);

        if(callback) { callback(); }
      } else {
        setTimeout(function() {
          getSongs();
        }, 500);
      }
    });
  }


  /** I hate myself. This function is so ugly, but it works. Will refactor it
  before final production push.**/
  function loop(queue) {
      var timer = (queue.minutes * 60000) + queue.seconds * 1000;
      setTimeout(function() {
          SongService.dispose(queue.id).then(a, b);

          function a(data, status, headers, config) {
            getSongs(ready);
          }

          function b(data, status, headers, config) {
            getSongs(ready);
          }
      }, timer - 1000);
  }

  //Event bus
  function onTubeReady(event) {
    if (tube.ready) {
      getSongs();
    }
  }

  function ready(song, call) {
    loop(song);
    tube.player.loadVideoById(songQueue.song);
    tube.player.playVideo();
  }

  /*Straight forward. Checks states, if a song ended, check queue
  and callback to reset.*/
  function onTubeStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
      tube.duration = tube.player.getDuration();

      $interval(function() {
        tube.curTime = tube.player.getCurrentTime();
      }, 1000);

      tube.state = 'playing';
    } else if (event.data == YT.PlayerState.PAUSED) {
      tube.player.playVideo();
    } else if (event.data == YT.PlayerState.ENDED) {
      tube.state = 'ended';
      deadPlayer();
    }
  }

  //Resets if an error occurs.
  function onTubeError(event) {
    getSongs(ready);
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
      playerVars: {
        'showinfo':0,
        'controls':0
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

  /*Queue function that I'm pretty sure I stopped using.
  Might come in handy so keeping it.*/
  this.queue = function(id) {
    queued.push({
      id: id
    });
    return queued;
  }

  this.getTube = function() {
    return tube;
  }

  this.getSong = function() {
    return songQueue;
  }
}
