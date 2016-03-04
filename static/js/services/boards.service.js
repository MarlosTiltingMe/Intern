Intern.factory('BoardsService', BoardsService);


function BoardsService($http) {

  function create(post) {
    return $http.post('/api/boards/', post);
  }

  function list() {
    return $http.get('/api/boards/');
  }

  function get(id) {
    return $http.get('/api/boards/' + id + '/', post);
  }

  function update(id, post) {
    return $http.put('/api/boards/' + id + '/', post);
  }

  function destroy(id) {
    return $http.delete('/api/boards/' + id + '/');
  }

  return {
    create: create,
    list: list,
    get: get,
    update: update,
    destroy: destroy
  };
}
