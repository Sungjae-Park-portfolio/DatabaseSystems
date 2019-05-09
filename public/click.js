angular.module('buttons', [])
    .controller('buttonCtrl', ButtonCtrl)
    .factory('buttonApi', buttonApi)
    .constant('apiUrl', 'http://localhost:1337');

function ButtonCtrl($scope, buttonApi) {
    $scope.buttons = [];
    $scope.movieList = [];
    $scope.timeList = [];
    $scope.timePool = [];
    $scope.errorMessage = '';
    $scope.isLoading = isLoading;
    $scope.getMovieList = getMovieList;
    $scope.getTimeList = getTimeList;
    $scope.movieTime = movieTime;
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

    String.prototype.hashCode = function(){
        var hash = 0;
        for (var i = 0; i < this.length; i++) {
            var character = this.charCodeAt(i);
            hash = ((hash<<5)-hash)+character;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    };

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
        if($scope.startTime === 0){
            $scope.startTime = Date.now();
        }
        buttonApi.clickButton($event.target.id)
            .success(function () {
                refreshButtons();
            })
            .error(function () {
                $scope.errorMessage = "Unable click";
            });//make sure the buttons are loaded
    }

    refreshButtons();
    getMovieList()
    getTimeList();

    function getTheSum(list) {
        var sum = 0;
        list.forEach(function (item) {
            sum += (item.amount * item.price);
        });
        return sum;
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



