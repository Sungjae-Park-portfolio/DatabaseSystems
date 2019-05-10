angular.module('buttons', [])
  .controller('buttonCtrl', ButtonCtrl)
  .factory('buttonApi', buttonApi)
  .constant('apiUrl', 'http://localhost:1337');


function ButtonCtrl($scope, $window, buttonApi) {
    $scope.buttons = [];
    $scope.movieList = [];
    $scope.timeList = [];
    $scope.timePool = [];
    $scope.errorMessage = '';
    $scope.isLoading = isLoading;
    $scope.getMovieList = getMovieList;
    $scope.getTimeList = getTimeList;
    $scope.movieTime = movieTime;
    $scope.getSeat = getSeat;
    $scope.getRow = getRow;
    $scope.getColumn = getColumn;
    $scope.simpleHash = simpleHash;
    $scope.getTimeByHours = getTimeByHours;
    $scope.refreshButtons = refreshButtons;
    $scope.buttonClick = buttonClick;
    $scope.getTheSum = getTheSum;
    $scope.itemDelete = itemDelete;
    $scope.activeUser;
    $scope.startTime = 0;

    $scope.logout = logout;
    $scope.login = login;
    $scope.voidSale = voidSale;
    $scope.sale = sale;
    $scope.username;
    $scope.password;
    $scope.receipt = null;
    $scope.getReceipt = getReceipt;

    var loading = false;

    function simpleHash(s, tableSize) {
        var i, hash = 0;
        for (i = 0; i < s.length; i++) {
            hash += (s[i].charCodeAt() * (i+1));
        }
        return Math.abs(hash) % tableSize;
    }

    function isLoading() {
        return loading;
    }

    function getTimeByHours(time) {
        return time.substring(11,19);
    }
    function movieTime(movieID) {
        $scope.timePool = [];
        var i = 0;
        var j = 0;
        while ($scope.timeList[i] != null) {
            if ($scope.timeList[i].Movie_ID == movieID) {
                $scope.timePool[j]=$scope.timeList[i].Schedule_BeginDateTime;
                j++;
            }
            i++
        }

    }

    function getMovieList() {
        loading = true;
        $scope.errorMessage = '';
        buttonApi.getMovies()
            .success(function (data) {
                $scope.movieList = data;
                loading = false;
            })
            .error(function () {
                $scope.errorMessage = "Unable to load movieList: Databases request failed";
                loading = false;
            })
    }

    function getTimeList() {
        loading = true;
        $scope.errorMessage = '';
        buttonApi.getTimes()
            .success(function (data) {
                $scope.timeList = data;
                loading = false;
                //console.log($scope.timeList);
                //console.log(data);
            })
            .error(function () {
                $scope.errorMessage = "Unable to load movieList: Databases request failed";
                loading = false;
            })
    }

    function refreshButtons() {
        loading = true;
        $scope.errorMessage = '';
        buttonApi.getButtons()
            .success(function (data) {
                $scope.buttons = data;
                loading = false;
            })
            .error(function () {
                $scope.errorMessage = "Unable to load Buttons:  Database request failed";
                loading = false;
            });
    }

    function getSeat(seatID) {
        if (seatID <=9) {
            return getRow(Math.floor(seatID/3)) + " row " + getColumn(seatID%3) + " column at hall 1";
        }
        if (seatID > 9 && seatID <= 18) {
            return getRow(Math.floor((seatID-9)/3)) + " row " + getColumn((seatID-9)%3) + " column at hall 2";
        }
        else {
            return getRow(Math.floor((seatID-18)/3)) + " row " + getColumn((seatID-18)%3) + " column at hall 3";
        }
    }

    function getRow(row) {
        if (row == 0) {
            return "A";
        }
        if (row == 1) {
            return "B";
        }
        if (row == 3) {
            return "C";
        }
    }

    function getColumn(column) {
        if (column == 0) {
            return 3;
        } else {
            return column;
        }
    }

    function getReceipt() {
        loading = true;
        $scope.errorMessage = '';
        buttonApi.getButtons()
            .success(function (data) {
                $scope.receipt = data;
                loading = false;
            })
            .error(function () {
                $scope.errorMessage = "Unable to load Receipt:  Database request failed";
                loading = false;
            });
    }

    function itemDelete(Sch_ID, Seat_ID) {
        $scope.errorMessage = '';
        buttonApi.itemDelete(Sch_ID, Seat_ID)
            .success(function () {
                refreshButtons();
            })
            .error(function () {
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
    refreshButtons()
    getMovieList()
    getTimeList();

  function logout() {
    console.log($scope.activeUser);
    $scope.activeUser = null;
  }


    function login(username, password){
        buttonApi.login(username, password)
            .success(function (data) {
                if(data[0]){
                    $scope.activeUser = data[0].user_ID;
                }else{
                    $scope.activeUser = null;
                }

            })
            .error(function () {
                $scope.errorMessage = "Our uncrackable login server has failed!?";
            });
    }
    function logout(){
        console.log($scope.activeUser);
        $scope.activeUser = null;
    }
    function sale(){
        $scope.receipt = getReceipt()
        buttonApi.sale($scope.startTime, Date.now(), $scope.activeUser);
        $scope.receipt = angular.element( document.querySelector( "#itemList"));
        $scope.startTime = 0;
        refreshButtons();
    }
    function voidSale(){
        buttonApi.voidSale();
        $scope.startTime = 0;
        refreshButtons();
    }

    $scope.getPop = function() {
        var i = 0;
        var temp = "";
        while ($scope.buttons[i] != null) {
            temp = temp + $scope.buttons[i].Movie_Name;
            i++;
        }
        $window.alert(temp);
    }
}

function buttonApi($http, apiUrl) {
    return {
        getMovies: function () {
            var url = apiUrl + '/movieList';
            return $http.get(url);
        },
        getTimes: function () {
            var url = apiUrl + '/timeList';
            return $http.get(url);
        },
        getButtons: function () {
            var url = apiUrl + '/cart';
            return $http.get(url);
        },
        clickButton: function (id) {
            var url = apiUrl + '/click?id=' + id;
            return $http.get(url);
        },
        itemDelete: function (Sche_ID, Seat_ID) {
            var url = apiUrl + '/delete/' + Sche_ID + "/" + Seat_ID;
            return $http.get(url);
        },
        login: function (username, password){
            var url = apiUrl + '/login/' + username + "/" + password;
            return $http.get(url);
        },
        voidSale: function (){
            var url = apiUrl + '/void';
            return $http.get(url);
        },
        sale: function (startTime, endTime, userID){
            var url = apiUrl + '/sale/' + new Date(startTime).toJSON() + "/" + new Date(endTime).toJSON() + "/" + userID;
            return $http.get(url);
        }
    };
}

