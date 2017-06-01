const deviceId = "MAKERSPACE-001";
const portId   = "/dev/ttyS0"

console.log("Device: "+deviceId)
console.log("Port: "+portId);

var users = {}
//________________________________________________________________
//SerialPort
var SerialPort = require("serialport");
var port = new SerialPort(portId, {
  baudRate: 9600
});

port.on('open',function(){
  console.log("Port "+portId+" opened!")

  port.on('data',function(data){
		var userId=data.toString('utf8');

		console.log("User ID: "+userId);
    ans = ""
    if(users[userId]){
      if(users[userId].active){
        ans="autorized"
        writeData("ok "+users[userId].name.toUpperCase());
      }
      else{
        ans="not_autorized"
        writeData("nk");
      }
    }
    else{
      ans="not_know"
      writeData("nn");
    }
    addAccess(userId,deviceId,ans);
	});
});

function writeData(d){
	port.write(d);
}


//________________________________________________________________
//Firebase
var firebase = require("firebase");
firebase.initializeApp({
  databaseURL: "<YOUR FIREBASE DATABASE URL"
});
loadUsers()

function loadUsers(){
  this.usersRef = firebase.database().ref().child('users')
  this.usersRef.on('child_added', (data)=>{
    users[data.key] = data.val()
    console.log(users)
  })
  this.usersRef.on('child_changed',(data)=>{
    users[data.key] = data.val()
  })
  this.usersRef.on('child_removed', (data)=>{
    users[data.key] = null
  })
}

function addAccess(userId,deviceId,autorized){
	var accessRef = firebase.database().ref().child('access')
	accessRef.push({
		date  : firebase.database.ServerValue.TIMESTAMP,
		U_id  : userId,
		dev_id: deviceId,
		autorized:autorized
	});
}
