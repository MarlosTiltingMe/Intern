Intern.factory('UserService', UserService);


function UserService($http) {

  function create(post) {
    return $http.post('/api/users/', post);
  }

  function list() {
    return $http.get('/api/users/');
  }

  function get(id) {
    return $http.get('/api/users/' + id + '/');
  }

  function update(id, post) {
    return $http.put('/api/users/' + id + '/', post);
  }

  function destroy(id) {
    return $http.delete('/api/users/' + id + '/');
  }

  return {
    create: create,
    list: list,
    get: get,
    update: update,
    destroy: destroy
  };
}
