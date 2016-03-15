Intern.service('PlayerService', PlayerService);

Intern.config(function($httpProvider) {
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

function PlayerService($window, $http, $rootScope, SongService) {

  var service = this;
  var obj = {};

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
  };

  var songQueue = {
    id: null,
    song: null,
    minutes: null,
    seconds: null,
    length: null
  };

  //Player is ready
  $window.onYouTubeIframeAPIReady = function() {
    tube.ready = true;
    service.bind('player');
    service.load();
    $rootScope.$apply();
  }

  function getSongs(callback) {

    SongService.list().success(function(data) {
      songQueue.id = data[0].id;
      songQueue.song = data[0].song;
      songQueue.minutes = data[0].minutes;
      songQueue.seconds = data[0].seconds;

      songQueue.length = data.length;
      loop(songQueue);
      if(callback)  callback();
    });
  }

  function decimate(callback) {

    SongService.dispose(songQueue.id).success(function() {
      if (callback) callback();
    });
  }

  function loop(data) {
    var timer = (data.minutes * 60000) + data.seconds * 1000;
    setTimeout(function() {
      SongService.dispose(data.id).then(a, b);

      function a(data, status, headers, config) {
        getSongs(ready);
      }

      function b(data, status, headers, config) {
        getSongs(ready);
      }

    }, timer - 2000);
  }

  //Event bus
  function onTubeReady(event) {
    getSongs(ready);
  }

  function ready() {
    tube.player.loadVideoById(songQueue.song);
    tube.player.playVideo();
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
      getSongs(ready);
      $rootScope.$apply();
    }
  }

  //Resets if an error occurs.
  function onTubeError(event) {
    alert('No songs pending.. Request one!');
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
      vars: {
        rel: 0,
        showinfo: 0,
        autoplay: 1,
        controls: 1
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
    switch (e.which || e.keyCode) {
      case 39: //down
        tube.player.mute();
        break;

      case 37: //up
        tube.player.unMute();
        break;
    }
  }
}
