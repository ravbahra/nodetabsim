var app = angular.module("tableSelectionApp", ['ngAnimate']);
var setMaxDigits = 3;

var socket = io('/client_namespace');



app.controller("tableSelectionController", function ($scope,$timeout) {
    socket.on('table_registration_answer', function (msg) {
        if (msg == 'ok') {
            console.log('its ok');
            $scope.show_screen = false;
            $scope.$apply();
        } else {
            //need to rereg
            console.log('nope');
        }
    });
    $scope.enteredNumberStr = '';
    $scope.show_screen = true;

    //$scope.bReady = false;

    $scope.sendData = function () {
        if ($scope.enteredNumberStr.length > 0) {
            var tableNumberDecimal = parseInt($scope.enteredNumberStr);

            socket.emit('check_table_availability', tableNumberDecimal);
            
        }
    };
 
    $scope.myNoodle = function (r) {
        if ($scope.enteredNumberStr == '') {
            if (r != 0) {
                addNumber(r);
            }
        } else {
            addNumber(r);
        }

    };
    var addNumber = function (num) {
        if ($scope.enteredNumberStr.length < setMaxDigits) {
            $scope.enteredNumberStr = $scope.enteredNumberStr + num;
        } else {
            $scope.enteredNumberStr = '';
            if (num != 0) {
                $scope.enteredNumberStr = $scope.enteredNumberStr + num;
            }
        }
    };



    $scope.hidden = false;
    $scope.msvisibility = {
        home: true,
        appetisers: false,
        mainmeal: false,
        drinks: false
    };

    $scope.setSectionValue = function (str) {
        $scope.msvisibility.home = false;
        $scope.msvisibility.appetisers = false;
        $scope.msvisibility.mainmeal = false;
        $scope.msvisibility.drinks = false;

        if (str == 'home') {
            $scope.msvisibility.home = true;
        }
        if (str == 'appetisers') {
            $scope.msvisibility.appetisers = true;
        }
        if (str == 'mainmeal') {
            $scope.msvisibility.mainmeal = true;
        }
        if (str == 'drinks') {
            $scope.msvisibility.drinks = true;
        }

    }


    $scope.fooditems_starters = [{
        orderid: '0',
        mealname: 'Tomato Soup',
        description: 'This soup is thick and wholesome.',
        hasimage: 'true',
        cost: '3.40',
        image: 'http://mda.bigoven.com/pics/rs/256/recipe-no-image.jpg',
        maincategories: ['V', 'GF']
    }, {
        orderid: '1',
        mealname: 'Asparagus Soup',
        description: 'description for asparagus soup',
        hasimage: 'true',
        cost: '4.99',
        image: 'http://mda.bigoven.com/pics/rs/256/recipe-no-image.jpg',
        maincategories: ['V', 'GF']
    }, {
        orderid: '2',
        mealname: 'Buckaroo Soup',
        description: 'Suckaroo Fuckaroo',
        hasimage: 'true',
        cost: '3.99',
        image: 'http://mda.bigoven.com/pics/rs/256/recipe-no-image.jpg',
        maincategories: ['V', 'GF']
    }, {
        orderid: '3',
        mealname: 'Shrimp Salad',
        description: 'Salad with Shrimps',
        hasimage: 'true',
        cost: '6.89',
        image: 'http://mda.bigoven.com/pics/rs/256/recipe-no-image.jpg',
        maincategories: ['V']
    }, {
        orderid: '4',
        mealname: 'Pea & Mint',
        description: 'A perfect blend of vibrant garden peas and stock',
        hasimage: 'true',
        cost: '3.98',
        image: 'http://mda.bigoven.com/pics/rs/256/recipe-no-image.jpg',
        maincategories: ['V', 'GF']
    }, {
        orderid: '5',
        mealname: 'Asparagus Soup',
        description: 'Asparagus soup mother fucker yeah this is the shit',
        cost: '4.40',
        hasimage: 'true',
        image: 'http://mda.bigoven.com/pics/rs/256/recipe-no-image.jpg',
        maincategories: ['V', 'GF']
    }, {
        orderid: '6',
        mealname: 'Chicken Edamame & Ginger',
        description: 'piddle soup mother fucker',
        hasimage: 'true',
        cost: '8.59',
        image: 'http://mda.bigoven.com/pics/rs/256/recipe-no-image.jpg',
        maincategories: ['V', 'GF']
    }, {
        orderid: '7',
        mealname: 'Chicken & Broccoli',
        description: 'Absolutely rank',
        hasimage: 'true',
        cost: '8.40',
        image: 'http://mda.bigoven.com/pics/rs/256/recipe-no-image.jpg',
        maincategories: ['V']
    }, {
        orderid: '8',
        mealname: 'Vetetable Tagine',
        description: 'Made with ripe tomatoes, chickpeas and lentils',
        hasimage: 'true',
        cost: '9.47',
        image: 'http://mda.bigoven.com/pics/rs/256/recipe-no-image.jpg',
        maincategories: ['V']
    }, ];

    $scope.clickedanimations = [false, false, false, false, false, false, false, false];

    $scope.blurBackground = false;

    $scope.vegetarian = false;
    $scope.glutenfree = false;

    $scope.selectedIndex = 0;

    var findLetter = function (str, index) {
        var found = false;
        var myarray = $scope.fooditems_starters[index].maincategories;
        for (var i = 0; i < myarray.length; i++) {
            if (myarray[i] == str) {
                found = true;
            }
        }
        return found;
    }

    $scope.setAnimation = function (indexFoodItem) {
        $scope.vegetarian = false;
        $scope.glutenfree = false;
        $scope.vegetarian = findLetter('V', indexFoodItem);
        $scope.glutenfree = findLetter('GF', indexFoodItem);

        $scope.selectedIndex = indexFoodItem;
        //$scope.blurBackground = true;
        $scope.fooditem_imgsrc = $scope.fooditems_starters[indexFoodItem].image;

        $scope.clickedanimations[indexFoodItem] = true;
        $timeout(function () {
            $scope.clickedanimations[indexFoodItem] = false;
        }, 300);

        $scope.showFoodDetails = true;
        $scope.blurBackground = true;

    }

    $scope.bAniButton = false;
    $scope.back = function () {
        $scope.bAniButton = true;
        $timeout(function () {
            $scope.bAniButton = false;
            $scope.showFoodDetails = false;
            $scope.blurBackground = false;
        }, 100);


    }

    $scope.bAniButtona2o = false;


    $scope.orderList = [];

    $scope.getTotalOrder = function () {
        if ($scope.orderList.length == 0) {
            return 0;

        } else {
            var total = 0;
            for (var f = 0; f < $scope.orderList.length; f++) {
                total += $scope.orderList[f].quantity;
            }
            return total
        }
    }

    $scope.addtoorder = function () {
        $scope.bAniButtona2o = true;

        if ($scope.orderList.length == 0) {

            var newOrderAddition = {
                orderid: $scope.selectedIndex,
                quantity: 1
            };
            $scope.orderList.push(newOrderAddition);

        } else {
            //array not empty, check if an element exists
            var isInList = false;

            for (var f = 0; f < $scope.orderList.length; f++) {
                if ($scope.orderList[f].orderid == $scope.selectedIndex) {
                    isInList = true;
                    $scope.orderList[f].quantity += 1;
                }
            }

            if (!isInList) {
                var newOrderAddition = {
                    orderid: $scope.selectedIndex,
                    quantity: 1
                };
                $scope.orderList.push(newOrderAddition);
            }
        }
        $timeout(function () {
            $scope.bAniButtona2o = false;
            /**/
            $scope.orderQuantity = 3;
            //check if element in

            $scope.showFoodDetails = false;
            $scope.blurBackground = false;

        }, 400);
    }
    $scope.showFoodDetails = false;
    /*
    $scope.reset = function(){
      $timeout(function(){
        
      });
    }
    */

    $scope.orderQuantity = 5;
    $scope.orderButtonAnim = false;
    $scope.orderButtonClicked = function () {
        $scope.showOrders = true;
        $scope.orderButtonAnim = true;
        $timeout(function () {
            $scope.orderButtonAnim = false;
        }, 100);
    }

    $scope.showOrders = false;

    $scope.fromOrderIdGetMealName = function (iOrderid) {
        var name = '';
        var cost = '';
        for (var i = 0; i < $scope.fooditems_starters.length; i++) {
            if ($scope.fooditems_starters[i].orderid == iOrderid) {
                name = $scope.fooditems_starters[i].mealname;
                cost = $scope.fooditems_starters[i].cost;
            }
        }
        return [name, cost];
    }

    $scope.submitOrder = function () {
        var tableNumberDecimal = parseInt($scope.enteredNumberStr);
        $scope.showOrders = false;
        var dataToSend = { tableNumber: tableNumberDecimal, order: $scope.orderList };
        //socket.emit('order_info', JSON.stringify(dataToSend));
        
        socket.emit('order_info', angular.copy(dataToSend));

    }
    $scope.showOrderReceived = false;
    $scope.orderReceived = false;
    socket.on('order_received', function (str) {
    
        $scope.showOrderReceived = true;
        $scope.orderList = [];

        $scope.$apply();
    });


});