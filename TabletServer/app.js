var app = require('express')();
var http = require('http').Server(app);

var io = require('socket.io')(http);
var client_io = io.of('/client_namespace');
var server_io = io.of('/server_namespace');

var listeningPort = 3000;

var tablesRegistered = [];

var orderData = [];
/*
tablesRegistered.push({id:'a',tableNumber:3});
tablesRegistered.push({id:'b',tableNumber:4});
tablesRegistered.push({id:'c',tableNumber:6});
tablesRegistered.push({id:'d',tableNumber:7});
tablesRegistered.push({id:'e',tableNumber:9});

*/
var fooditems_starters = [{
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
    },];

function removeTable(idRemove) {
	var newD = tablesRegistered.filter(function (element) {
		
		if (element.id != idRemove) {
			return true;
		} else {
			return false;
		}
    
	});
	tablesRegistered = newD;
 
}


function checkIfTableRegistered(tableToReg) {
	var alreadyRegistered = false;
	for (var i = 0; i < tablesRegistered.length; i++) {
		if (tablesRegistered[i].tableNumber == tableToReg) {
			alreadyRegistered = true;
		}
	}
	return alreadyRegistered;
}


app.get('/', function (req, res) {
	res.sendFile(__dirname+'/webfiles/index.html');
});

app.get('/server_monitor', function (req, res) {
    res.sendFile(__dirname + '/webfiles/server_monitor.html');
});

app.get('/tablet.css', function (req, res) {
	res.sendFile(__dirname + '/webfiles/tablet.css');
});

app.get('/controller.js', function (req, res) {
	res.sendFile(__dirname + '/webfiles/controller.js');
});

app.get('/socket.js', function (req, res) {
	res.sendFile(__dirname + '/webfiles/socket.js');
});

client_io.on('connection', function (socket) {
	
	var socketID = socket.client.conn.id;
	console.log('a customer or chef connected ' + socketID);


	socket.on('disconnect', function () {
		console.log('a disconnect from user or chef ' + socketID);
		removeTable(socketID);
		//remove table
	});

	socket.on('check_table_availability', function (msg) {
		var tableNum = parseInt(msg);
		console.log('User with socket: ' + socketID + ' would like to register on table ' + msg);
		//if not registered
		if (!checkIfTableRegistered(tableNum)) {
			tablesRegistered.push({ id: socketID, tableNumber: tableNum });
			//send back to client
		
			client_io.connected['/client_namespace#'+socketID].emit('table_registration_answer','ok');
		} else {
			//return back to user we can't do that
            client_io.connected['/client_namespace#' + socketID].emit('table_registration_answer', 'taken');
		}
    });

    socket.on('order_info', function (msg) {
        client_io.connected['/client_namespace#' + socketID].emit('order_received', 'ok');
        //dataReceived = JSON.parse(msg);
        orderData.push(msg);
        server_io.emit('order_received', msg);

    });
});

server_io.on('connection', function (socket) {
    //just to the new user send them the entire table
    var socketID = socket.client.conn.id;
    //var complete_table = JSON.stringify(orderData)
    server_io.connected['/server_namespace#' + socketID].emit('complete_data', orderData);
    socket.on('disconnect', function () {
        console.log('a disconnect from server/chef ' + socketID);
        removeTable(socketID);
		//remove table
    });
    
});




http.listen(listeningPort, function () {
	
    console.log('listening on port ' + listeningPort);

});