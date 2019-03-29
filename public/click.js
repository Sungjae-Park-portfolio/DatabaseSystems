angular.module('buttons', [])
    .controller('buttonCtrl', ButtonCtrl)
    .factory('buttonApi', buttonApi)
    .constant('apiUrl', 'http://localhost:1337'); // CHANGED for the lab 2017!

function ButtonCtrl($scope, buttonApi) {
    $scope.buttons = []; //Initially all was still
    $scope.errorMessage = '';
    $scope.isLoading = isLoading;
    $scope.refreshButtons = refreshButtons;
    $scope.buttonClick = buttonClick;
    $scope.getTheSum = getTheSum;
    $scope.itemDelete = itemDelete;




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

    function itemDelete(id) {
        $scope.errorMessage = '';

        buttonApi.itemDelete(id)
            .success(function () {
                refreshButtons();
            })
            .error(function () {
                $scope.errorMessage = "you cannot delete //make sure the buttons are loadedme hahaha";
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
            });//make sure the buttons are loaded
    }

    refreshButtons();


    function getTheSum(list) {
        var sum = 0;
        list.forEach(function (item) {
            sum += (item.amount * item.price);
        });
        return sum;
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
        }
    };
}






