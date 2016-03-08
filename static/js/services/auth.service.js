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
    if($cookies.get('session')) {
      return true;
    } else {
      return false;
    }
    //For some reason return !!cookies.get('session') didn't return proper data..
  }

  function login(username, password) {
    return $http.post('/api-auth/login/', {
      username: username,
      password: password
    }).then(loginSuccessFn, loginErrorFn);

    function loginSuccessFn(data, status, headers, config) {
      AuthService.setAuthenticatedAccount(data.config.data);
      window.location = '/';
    }

    function loginErrorFn(data, status, headers, config) {
      alert('Error logging you in');
    }
  }

  function logout() {
    if(AuthService.isAuthenticated()) {
      return $http.post('/api-auth/logout/')
        .then(logoutSuccessFn, logoutErrorFn);
      } else {
        alert('Can\'t logout when you\'re not even logged in, silly goose.');
      }

      function logoutSuccessFn(data, status, headers, config) {
        AuthService.unauthenticate();
        alert('You\'ve been logged out.');
        window.location = '/';
      }

      function logoutErrorFn(data, status, headers, config) {
        alert("Ruh roh, raggy! Ran into an error whilst trying to log you out!.");
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
    return $http.get('/api/user/' + account.username + '/').success(function(data) {
      $cookies.put('session', data[0].auth_token);
      $cookies.put('name', account.username);
    });
  }

  function unauthenticate() {
    $cookies.remove('session');
    $cookies.remove('name');
  }
}
