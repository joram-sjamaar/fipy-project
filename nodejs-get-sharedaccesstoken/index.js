var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
var Message = require('azure-iot-device').Message;

var connectionString = 'HostName=iotc-c456aa00-d6da-4b61-91c4-fe5dbda847e2.azure-devices.net;DeviceId=1mp8wo6ck0z;SharedAccessKey=1/oZoFV02MHFOIaI2iH9IuOAOQQkLisTmBYQiOE9qXo=';

var client = clientFromConnectionString(connectionString);


var connectCallback = function (err) {
  if (err) {
    console.error('Could not connect: ' + err);
  } else {
    console.log('Client connected');
    var message = new Message('some data from my device');
    client.sendEvent(message, function (err) {
      if (err) console.log(err.toString());
    });

    client.on('message', function (msg) { 
      console.log(msg); 
      client.complete(msg, function () {
        console.log('completed');
      });
    }); 
  }
};

client.open(connectCallback);