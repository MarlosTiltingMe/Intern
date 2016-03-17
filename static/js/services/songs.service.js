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

  function archive(post) {
    return $http.post('/api/Archives/', post);
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

  function dispose(id) {
    return $http.delete('/api/songs/' + id + '/');
  }

  return {
    create: create,
    list: list,
    get: get,
    update: update,
    archiveList: archiveList,
    dispose: dispose,
    archive: archive
  };
}
