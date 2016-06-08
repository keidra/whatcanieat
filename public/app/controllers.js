angular.module('ProductCtrls', ['ProductServices'])
.controller('HomeCtrl', ['$scope', '$location', '$http', 'Product', function($scope, $location, $http, Product) {
  $scope.products = [];

   $scope.favorites = [];
  
  $scope.addFav = function(id) {
    $http.post('/api/users/product/' + id);
    $location.path('/favorites');
  }

  $http.get('/api/users/products').then(function success(res){
    console.log(res)
    $scope.favorites = res.data;
  },function error(res){})

  Product.query(function success(data) {
    $scope.products = data;
  }, function error(data) {
    console.log(data);
  });

   $scope.deleteProduct = function(id, productsIdx) {
    Product.delete({id: id}, function success(data) {
      $scope.favorites.splice(productsIdx, 1);
    }, function error(data) {
      console.log(data);
    });
  }

}])

.controller('ShowCtrl', ['$scope', '$stateParams', 'Product', function($scope, $stateParams, Product) {
  $scope.product = {};

  Product.get({id: $stateParams.id}, function success(data) {
    $scope.product = data;
  }, function error(data) {
    console.log(data);
  });
}])



.controller('NavCtrl', ['$scope', 'Auth', '$state', 'Alerts', function($scope, Auth, $state, Alerts) {
  $scope.Auth = Auth;
  $scope.logout = function() {
    Auth.removeToken();
    Alerts.add('success', 'Logged out!');
    $state.reload();
  }
}])
.controller('SignupCtrl', ['$scope', '$http', '$location', 'Alerts', function($scope, $http, $location, Alerts) {
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.userSignup = function() {
    $http.post('/api/users', $scope.user).then(function success(res) {
      Alerts.add('success', 'Sign up successful!');
      $location.path('/start');
    }, function error(res) {
      Alerts.add('danger', 'Error. See console');
      console.log(res);
    });
  }
}])
.controller('LoginCtrl', ['$scope', '$http', '$location', 'Auth', 'Alerts', function($scope, $http, $location, Auth, Alerts) {
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.userLogin = function() {
    $http.post('/api/auth', $scope.user).then(function success(res) {
      Auth.saveToken(res.data.token);
      Alerts.add('success', 'Logged in!');
      console.log('Token:', res.data.token);
      $location.path('/start');
    }, function error(res) {
      Alerts.add('danger', 'Incorrect email/password');
      console.log(res);
    });
  }
}])
.controller('AlertCtrl', ['$scope', 'Alerts', function($scope, Alerts) {
  $scope.Alerts = Alerts;
}]);
