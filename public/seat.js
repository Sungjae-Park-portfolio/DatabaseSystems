var mooApp = angular.module('mooApp', []);

mooApp.controller('boo', function($scope, rowCalc) {
    /*
        $scope.seats = [
          [{
            "Seat_ID": 1,
            "Hall_ID": 1,
            "Seat_Row": "a",
            "Seat_Column": 1,
            "Seat_Available": 0,
            "Seat_Check": 0
          }, {
            "Seat_ID": 2,
            "Hall_ID": 1,
            "Seat_Row": "a",
            "Seat_Column": 2,
            "Seat_Available": 0,
            "Seat_Check": 0
          }, {
            "Seat_ID": 3,
            "Hall_ID": 1,
            "Seat_Row": "a",
            "Seat_Column": 3,
            "Seat_Available": 1,
            "Seat_Check": 0
          }],
          [{
            "Seat_ID": 4,
            "Hall_ID": 1,
            "Seat_Row": "b",
            "Seat_Column": 1,
            "Seat_Available": 0,
            "Seat_Check": 0
          }, {
            "Seat_ID": 5,
            "Hall_ID": 1,
            "Seat_Row": "b",
            "Seat_Column": 2,
            "Seat_Available": 0,
            "Seat_Check": 0
          }, {
            "Seat_ID": 6,
            "Hall_ID": 1,
            "Seat_Row": "b",
            "Seat_Column": 3,
            "Seat_Available": 1,
            "Seat_Check": 0
          }]
        ];
    */
    $scope.quantities = [];
    $scope.seats = [];
    $scope.isDisabled = false;
    $scope.selectedSeatCount = 0;
    $scope.errorMessage = '';
    $scope.rowLetter = [];
    $scope.count = 0;
    $scope.confirmButton = confirmButton;

    var loading = false;

    function isLoading() {
      return loading;
    }

    $scope.clickSeat = function(seat) {
      if (seat.Seat_Available && !$scope.isDisabled) {
        if (seat.Seat_Check) {
          seat.Seat_Check = false;
          $scope.selectedSeatCount--;
        } else if ($scope.selectedSeatCount < $scope.selectedVal) {
          seat.Seat_Check = true;
          $scope.selectedSeatCount++;
        }
      }

    }

    function getSeatMap() {
      loading = true;
      var id = 1;
      var temp = [];
      $scope.errorMessage = '';
      rowCalc.getSeats(id)
        .success(function(data) {
          temp = data;
          var rowName = [];
          var j = 0;
          var count = 0;
          rowName.push(temp[j].Seat_Row);
          for (var i = 1; i < temp.length; i++) {
            if (temp[i].Seat_Available == 1) {
              count++;
            }
            if (temp[i].Seat_Row != rowName[j]) {
              j++;
              rowName[j] = temp[i].Seat_Row;
            }
          }
          for (var i = 0; i < count; i++) {
            $scope.quantities.push(i + 1);
          }
          var rowNum = [];
          for (var i = 0; i < temp.length; i++) {
            if (rowNum[temp[i].Seat_Row.charCodeAt(0) - 97] == null) {
              rowNum[temp[i].Seat_Row.charCodeAt(0) - 97] = 1;
            } else {
              rowNum[temp[i].Seat_Row.charCodeAt(0) - 97]++;
            }
          }
          var row = [];
          var k = 0;
          for (var i = 0; i < rowName.length; i++) {
            row = [];
            for (var j = 0; j < rowNum[i]; j++) {
              row.push(temp[k]);
              k++;
            }
            $scope.seats.push(row);
          }
          $scope.rowLetter = rowStack(temp);
          loading = false;
        })
        .error(function() {
          $scope.errorMessage = "Unable to load Buttons:  Database request failed";
          loading = false;
        });
    }

    function rowStack(add) {
      var rowLetter = [];
      var count = 0;
      add.forEach(function(seat) {
        if (seat.Seat_Row == 'a') {
          count++;
        }
      })
      for (var i = 0, j = 65; i < add.length / 3; i++, j++) {
        rowLetter.push(String.fromCharCode(j));
      }
      return rowLetter;
    }

    function confirmButton() {
      var checkedSeat = [];
      $scope.seats.forEach(function(row) {
        row.forEach(function(seat){
          if(seat.Seat_Check == true) {
            checkedSeat.push(seat.Seat_ID);
          }
        })
      })
      console.log(checkedSeat);
      rowCalc.bookSeats(checkedSeat);
    }

    getSeatMap();

  })
  .service('rowCalc', function($http, apiUrl) {

    this.getSeats = function(id) {
      var url = apiUrl + '/seat/' + id;
      return $http.get(url);
    }

    this.bookSeats = function(obj) {
      var data = angular.toJson(obj);
      console.log(data);
      var url = apiUrl + '/bookSeats/' + obj;
      console.log(url);
      return $http.get(url);
    }

  })
  .constant('apiUrl', 'http://localhost:1337');
/*
  .factory('rowCalc', rowApi);


  function rowApi ($http) {
    return {
      rowStack: function(obj){
        var rowLetter = [];
        for (var i = 0, j = 65; i < obj.length; i++, j++) {
          rowLetter.push(String.fromCharCode(j));
        }
        return rowLetter;
      },
      getSeats: function() {
        var apiUrl = 'http://localhost:1337';
        var url = apiUrl + '/seat';
        return $http.get(url);
      }
    }
  };*/
