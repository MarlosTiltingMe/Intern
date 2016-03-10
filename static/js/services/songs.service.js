Intern.factory('SongService', SongService);


function SongService($http, AuthService) {

  function create(post) {
    return $http.post('/api/songs/', post);
  }

  function list() {
    return $http.get('/api/songs/');
  }

  function archiveList() {
    return $http.get('/api/Archives/');
  }

  function get(id) {
    return $http.get('/api/songs/' + id + '/');
  }

  function update(id, post) {
    return $http.put('/api/songs/' + id + '/', post);
  }

  function archive(post) {
    return $http.post('/api/Archives/', post);
  }

  /**
  The mother of all functions. This terrible looking thing handles
  most of the erroneous states that the player might run into.

  a(); is being called if/when request is successful, if not, call b();.

  Then I check the length of data.data to make sure there's a song to delete
  before I actually delete it. If there isn't, callback(normally PlayerService.reset()).

  c(); is checking i & amount to make sure the callback doesn't happen before it should.

  d(); is just calling back regardless. If d is ever called, it means that the check
  on line 52 didn't work for some reason. Or that the delete request failed.
  At any rate, it just calls back in hopes that the error will fix itself, because
  at that point, without me being at the terminal to check what's happening, that's
  the best option.
   **/
  function destroy(songs, amount, callback) {
    for(var i = 0; i < amount; i++) {
      if(songs.length > 0) {
        var user = AuthService.getAuthenticatedAccount();
        if(AuthService.isAuthenticated()) {
          archive({song:songs[i].song, upvotes:1, requester:user.id});
        }
      }
      if(songs.length > 0) {
        var request = $http.get('/api/song/' + songs[i].song + '/').then(a, b);
      }

      function a(data, status, headers, config) {

        if(data.data.length > 0) {
          return $http.delete('/api/songs/' + data.data[0].id + '/').then(c, d);
        } else {
          if(callback)  callback();
        }

        function c(data, status, headers, config) {
          if(i == amount && callback)  callback();
        }

        function d(data, status, headers, config) {
          if(callback)  callback();
        }
    }
    function b(data, status, headers, config) {
      if(callback)  callback();
    }
  }
}

  return {
    create: create,
    list: list,
    get: get,
    update: update,
    destroy: destroy,
    archiveList: archiveList
  };
}
