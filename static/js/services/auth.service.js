Intern.factory("AuthService", AuthService);
AuthService.$inject = ['$cookies', '$http'];

function AuthService($cookies, $http) {
  var AuthService = {
    checkAuth: checkAuth,
    isAuthenticated: isAuthenticated,
    login: login,
    logout: logout,
    register: register,
    setAuthenticatedAccount: setAuthenticatedAccount,
    unauthenticate: unauthenticate
  };

  return AuthService;

  function checkAuth(username) {
    return $http.get('/api/user/' + username + '/').success(function(data) {
      return data;
    })
    .error(function(err) {
      console.log(err)
      return err;
    });
  }

  function isAuthenticated() {
    return !!$cookies.session;
  }

  function login(username, password) {
    return $http.post('/api-auth/login/', {
      username: username,
      password: password
    }).then(loginSuccessFn, loginErrorFn);

    function loginSuccessFn(data, status, headers, config) {
      AuthService.setAuthenticatedAccount(data.config.data);
    //  window.location = '/';
    }

    function loginErrorFn(data, status, headers, config) {
      alert('Error logging you in');
    }
  }

  function logout() {
    return $http.post('/api-auth/logout/')
      .then(logoutSuccessFn, logoutErrorFn);

      function logoutSuccessFn(data, status, headers, config) {
        AuthService.unauthenticate();
        window.location = '/';
      }

      function logoutErrorFn(data, status, headers, config) {
        alert("Logout error.");
      }
  }

  function register(email, username, password) {
    return $http.post('/api/users/', {
      email: email,
      username: username,
      password: password
    }).then(registerSuccessFn, registerErrorFn);

    function registerSuccessFn(data, status, headers, config) {
      AuthService.login(username, password);
      window.location = '/';
    }

    function registerErrorFn(data, status, headers, config) {
      alert("Registration error xdxd");
    }
  }

  function setAuthenticatedAccount(account) {
    return $http.post('/api-token-auth/', {
      username: account.username,
      password: account.password
    }).then(authSuccessFn, authErrorFn);

    function authSuccessFn(data, status, headers, config) {
      $cookies.put('session', data.data.token);
      $cookies.put('name', account.username);
    }

    function authErrorFn(data, status, headers, config) {
      alert('There was an error retrieving your authentication token! Right info?');
    }
  }

  function unauthenticate() {
    delete $cookies.session;
  }
}
