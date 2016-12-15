window.onload = function(){

  // app_idは自分のものに書き換えてください
  //var milkcocoa = new MilkCocoa("blueilasdost.mlkcca.com");
  //var dsn = milkcocoa.dataStore('nine');

  var nine_data = {"gx": 0, "gy": 0, "gz": 0, "rx": 0, "ry": 0, "rz": 0, "mx": 0, "my": 0, "mz": 0}

  window.addEventListener('devicemotion', function(e){

	//重力加速度センサー
    gravity = e.accelerationIncludingGravity;

    nine_data["gx"] = gravity.x;
    nine_data["gy"] = gravity.y;
    nine_data["gz"] = gravity.z;

    g_output.innerHTML
    = 'g-x: '+floatConvertSyncer(nine_data["gx"],1) +'<br/>'
    + 'g-y: '+floatConvertSyncer(nine_data["gy"],1) +'<br/>'
    + 'g-z: '+floatConvertSyncer(nine_data["gz"],1);

    //sendGravityFromNineAxisMotionSensors(gravity);

	//回転速度センサー
	rotation = e.rotationRate;

    nine_data["rx"] = rotation.beta;
    nine_data["ry"] = rotation.gamma;
    nine_data["rz"] = rotation.alpha;

    r_output.innerHTML
    = 'r-x: '+floatConvertSyncer(nine_data["rx"] ,1) +'<br/>'
    + 'r-y: '+floatConvertSyncer(nine_data["ry"] ,1) +'<br/>'
    + 'r-z: '+floatConvertSyncer(nine_data["rz"] ,1);

    //sendRotationFromNineAxisMotionSensors(rotation);
    //dsn.send(nine_data)
    send(nine_data)
  },true);


  window.addEventListener('deviceorientation',function(e){

    nine_data["mx"] = e.beta;
    nine_data["my"] = e.gamma;
    nine_data["mz"] = e.alpha;

	//地磁気センサー
    m_output.innerHTML
    = 'm-x: '+floatConvertSyncer(nine_data["mx"] ,1) +'<br/>'
    + 'm-y: '+floatConvertSyncer(nine_data["my"] ,1) +'<br/>'
    + 'm-z: '+floatConvertSyncer(nine_data["mz"] ,1);

    //sendMagnaticFromNineAxisMotionSensors(e);
    //dsn.send(nine_data)
    send(nine_data)
  },true);

  function sendGravityFromNineAxisMotionSensors(g){
      dsn.send({'gx': g.x, 'gy': g.y, 'gz':g.z});
  };

  function sendRotationFromNineAxisMotionSensors(r){
      dsn.send({'rx': r.beta, 'ry': r.gamma, 'rz':r.alpha});
  };

  function sendMagnaticFromNineAxisMotionSensors(m){
      dsn.send({'mx': m.beta, 'my': m.gamma, 'mz':m.alpha});
  };


  //桁揃え
  function floatConvertSyncer( num , dig ){
	  var p = Math.pow( 10 , dig ) ;
	  return Math.round( num * p ) / p ;
  };

    var client;
    getEndpoint(
        'ap-northeast-1', 
        'abb4wssef8fld.iot.ap-northeast-1.amazonaws.com',
        function(err, endpoint) {
          if (err) {
            console.log('failed', err);
            return;
          }
          var clientId = Math.random().toString(36).substring(7);
          client = new Paho.MQTT.Client(endpoint, clientId);
          var connectOptions = {
            useSSL: true,
            timeout: 3,
            mqttVersion: 4,
            onSuccess: subscribe
          };
          client.connect(connectOptions);
          //client.onMessageArrived = onMessage;
          client.onConnectionLost = function(e) { console.log(e) };
        });


 
  function send(content){
      var message = new Paho.MQTT.Message(window.JSON.stringify(content));
      message.destinationName = "nine";
      client.send(message);
  }

    function subscribe() {
      client.subscribe("nine");
      console.log("subscribed");
    }

    function onMessage(message) {
      r_output.innerHTML
      = message.payloadString;
      //data.messages.push(message.payloadString);
      console.log("message received: " + message.payloadString);
    }
};

