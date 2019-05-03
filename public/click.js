angular.module('buttons', [])
    .controller('buttonCtrl', ButtonCtrl)
    .factory('buttonApi', buttonApi)
    .constant('apiUrl', 'http://localhost:1337');

function ButtonCtrl($scope, buttonApi) {
    $scope.buttons = [];
    $scope.errorMessage = '';
    $scope.isLoading = isLoading;
    $scope.refreshButtons = refreshButtons;
    $scope.buttonClick = buttonClick;
    $scope.getTheSum = getTheSum;
    $scope.itemDelete = itemDelete;
    $scope.activeUser;

    $scope.logout = logout;
    $scope.login = login;
    $scope.voidSale = voidSale;
    $scope.sale = sale;
    $scope.username;
    $scope.password;
    $scope.receipt = null;
    $scope.getReceipt = getReceipt;

    var loading = false;

    function isLoading() {
        return loading;
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

    function itemDelete(id) {
        $scope.errorMessage = '';

        buttonApi.itemDelete(id)
            .success(function () {
                refreshButtons();
            })
            .error(function () {
                $scope.errorMessage = "you cannot delete";
            })



    }

    function buttonClick($event) {
        $scope.errorMessage = '';

        buttonApi.clickButton($event.target.id)
            .success(function () {
                refreshButtons();
            })
            .error(function () {
                $scope.errorMessage = "Unable click";
            });
        refreshButtons();
    }





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
                    $scope.activeUser = data[0].userId;
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
        $scope.receipt = angular.element( document.querySelector( "#itemList"));

        refreshButtons();
    }
    function voidSale(){
        buttonApi.voidSale();
        refreshButtons();
    }
}

function buttonApi($http, apiUrl) {
    return {
        getButtons: function () {
            var url = apiUrl + '/items';
            return $http.get(url);
        },
        clickButton: function (id) {
            var url = apiUrl + '/click?id=' + id;
            return $http.get(url);
        },
        itemDelete: function (id) {
            var url = apiUrl + '/delete?id=' + id;
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



