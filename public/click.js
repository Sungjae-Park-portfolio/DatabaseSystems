angular.module('buttons', [])
  .controller('buttonCtrl', ButtonCtrl)
  .factory('buttonApi', buttonApi)
  .constant('apiUrl', 'http://localhost:1337');


function ButtonCtrl($scope, buttonApi) {
  $scope.buttons = [];
  $scope.errorMessage = '';
  $scope.username;
  $scope.password;
  $scope.activeUser;
  $scope.startTime = 0;
  $scope.receipt = null;

  $scope.isLoading = isLoading;
  $scope.refreshButtons = refreshButtons;
  $scope.buttonClick = buttonClick;
  $scope.getTheSum = getTheSum;
  $scope.itemDelete = itemDelete;
  $scope.logout = logout;
  $scope.login = login;
  $scope.voidSale = voidSale;
  $scope.sale = sale;
  $scope.getReceipt = getReceipt;

  var loading = false;

  function isLoading() {
    return loading;
  }

  function refreshButtons() {
    loading = true;
    $scope.errorMessage = '';
    buttonApi.getButtons()
      .success(function(data) {
        $scope.buttons = data;
        loading = false;
      })
      .error(function() {
        $scope.errorMessage = "Unable to load Buttons:  Database request failed";
        loading = false;
      });
  }

  function getReceipt() {
    loading = true;
    $scope.errorMessage = '';
    buttonApi.getButtons()
      .success(function(data) {
        $scope.receipt = data;
        loading = false;
      })
      .error(function() {
        $scope.errorMessage = "Unable to load Receipt:  Database request failed";
        loading = false;
      });
  }

  function itemDelete(id) {
    $scope.errorMessage = '';

    buttonApi.itemDelete(id)
      .success(function() {
        refreshButtons();
      })
      .error(function() {
        $scope.errorMessage = "you cannot delete";
      })
  }

  function buttonClick($event) {
    $scope.errorMessage = '';
    if ($scope.startTime === 0) {
      $scope.startTime = Date.now();
    }
    buttonApi.clickButton($event.target.id)
      .success(function() {
        refreshButtons();
      })
      .error(function() {
        $scope.errorMessage = "Unable click";
      }); //make sure the buttons are loaded
  }

  refreshButtons();
  getSeatMap();

  function getTheSum(list) {
    var sum = 0;
    list.forEach(function(item) {
      sum += (item.amount * item.price);
    });
    return sum;
  }

  function sale() {
    $scope.receipt = getReceipt()
    buttonApi.sale($scope.startTime, Date.now(), $scope.activeUser);
    $scope.receipt = angular.element(document.querySelector("#itemList"));
    $scope.startTime = 0;
    refreshButtons();
  }

  function voidSale() {
    buttonApi.voidSale();
    $scope.startTime = 0;
    refreshButtons();
  }

  function login(username, password) {
    buttonApi.login(username, password)
      .success(function(data) {
        if (data[0]) {
          $scope.activeUser = data[0].user_ID;
        } else {
          $scope.activeUser = null;
        }
        console.log($scope.activeUser);
      })
      .error(function() {
        $scope.errorMessage = "Our uncrackable login server has failed!?";
      });
  }

  function logout() {
    console.log($scope.activeUser);
    $scope.activeUser = null;
  }

}

function buttonApi($http, apiUrl) {
  return {
    getButtons: function() {
      var url = apiUrl + '/schedule';
      return $http.get(url);
    },
    clickButton: function(id) {
      var url = apiUrl + '/click?id=' + id;
      return $http.get(url);
    },
    itemDelete: function(id) {
      var url = apiUrl + '/delete?id=' + id;
      return $http.get(url);
    },
    login: function(username, password) {
      var url = apiUrl + '/login/' + username + "/" + password;
      return $http.get(url);
    },
    voidSale: function() {
      var url = apiUrl + '/void';
      return $http.get(url);
    },
    sale: function(startTime, endTime, userID) {
      var url = apiUrl + '/sale/' + new Date(startTime).toJSON() + "/" + new Date(endTime).toJSON() + "/" + userID;
      return $http.get(url);
    }
  };
}
