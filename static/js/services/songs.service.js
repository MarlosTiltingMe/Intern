Intern.factory('SongService', SongService);


function SongService($http) {

  function create(post) {
    return $http.post('/api/songs/', post);
  }

  function list() {
    return $http.get('/api/songs/');
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

  function getArchives() {
    return $http.get('/Api/Archives/');
  }

  function destroy(songs) {
    for(var i = 0; i < 3; i++) {
      archive(songs[i]);
      var request = $http.get('/api/song/' + songs[i].song + '/').then(a, b);
      function a(data, status, headers, config) {
        return $http.delete('/api/songs/' + data.data[0].id + '/')
      }
      function b(data, status, headers, config) {
        console.log(data);
      }
    }
  }

  return {
    create: create,
    list: list,
    get: get,
    update: update,
    destroy: destroy
  };
}
