Intern.factory("AuthService", AuthService);
AuthService.$inject = ['$cookies', '$http', '$rootScope'];

function AuthService($cookies, $http, $rootScope) {
  var AuthService = {
    getAuthenticatedAccount: getAuthenticatedAccount,
    isAuthenticated: isAuthenticated,
    login: login,
    logout: logout,
    register: register,
    setAuthenticatedAccount: setAuthenticatedAccount,
    unauthenticate: unauthenticate
  };

  return AuthService;

  function getAuthenticatedAccount() {
    if(!$cookies.authenticatedAccount) {
      return;
    }
    console.log('a');
    return JSON.parse($cookies.authenticatedAccount);
  }

  function isAuthenticated() {
    return !!$cookies.authenticatedAccount;
  }

  function login(username, password) {
    return $http.post('/api-auth/login/', {
      username: username,
      password: password
    }).then(loginSuccessFn, loginErrorFn);

    function loginSuccessFn(data, status, headers, config) {
      AuthService.setAuthenticatedAccount(data.config.data);
      //window.location = '/';
    }

    function loginErrorFn(data, status, headers, config) {
      console.log(data.data);
    }
  }

  function logout() {
    return $http.post('/api-auth/logout/')
      .then(logoutSuccessFn, logoutErrorFn);

      function logoutSuccessFn(data, status, headers, config) {
        AuthService.unauthenticate();
      //  window.location = '/';
      }

      function logoutErrorFn(data, status, headers, config) {
        alert("Logout error.");
      }
  }

  function register(email, username, password, auth_token) {
    return $http.post('/api/users/', {
      email: email,
      username: username,
      password: password,
      auth_token: auth_token
    }).then(registerSuccessFn, registerErrorFn);

    function registerSuccessFn(data, status, headers, config) {
      AuthService.login(username, password);
    //  window.location = '/';
    }

    function registerErrorFn(data, status, headers, config) {
      alert("Registration error xdxd");
    }
  }

  function setAuthenticatedAccount(account) {
    var authdata = Base64.encode(account.username + ':' + account.password);
    $rootScope.globals = {
      currentUser: {
        username: account.username,
        authdata: authdata
      }
    };
    $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
    $cookies.put('session', $rootScope.globals);
    var a = JSON.parse($cookies.get('session'));
    console.log(a);
  }

  function unauthenticate() {
    delete $cookies.authenticatedAccount;
  }
}
