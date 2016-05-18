window.onload = function(){

  var currentMode = 'portrait';

  // app_idは自分のものに書き換えてください
  var milkcocoa = new MilkCocoa("blueilasdost.mlkcca.com");
  var dsg = milkcocoa.dataStore('gravity');
  var dsn = milkcocoa.dataStore('nine');

  var nine_data = {"gx": 0, "gy": 0, "gz":0}

  window.addEventListener('devicemotion', function(e){

	//重力加速度センサー
    gravity = e.accelerationIncludingGravity;

    g_output.innerHTML
    = 'g-x: '+floatConvertSyncer(gravity.x,1) +'<br/>'
    + 'g-y: '+floatConvertSyncer(gravity.y,1) +'<br/>'
    + 'g-z: '+floatConvertSyncer(gravity.z,1);

    sendGravityFromNineAxisMotionSensors(gravity);
    sendModeFromGravityValue(gravity);

	//回転速度センサー
	rotation = e.rotationRate;
    r_output.innerHTML
    = 'r-x: '+floatConvertSyncer(rotation.beta ,1) +'<br/>'
    + 'r-y: '+floatConvertSyncer(rotation.gamma,1) +'<br/>'
    + 'r-z: '+floatConvertSyncer(rotation.alpha,1);

    sendRotationFromNineAxisMotionSensors(rotation);
  },true);


  window.addEventListener('deviceorientation',function(e){
	//地磁気センサー
    m_output.innerHTML
    = 'm-x: '+floatConvertSyncer(e.beta ,1) +'<br/>'
    + 'm-y: '+floatConvertSyncer(e.gamma,1) +'<br/>'
    + 'm-z: '+floatConvertSyncer(e.alpha,1);

    sendMagnaticFromNineAxisMotionSensors(e);
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


  function sendModeFromGravityValue(g){

    // 絶対値を取得
    var x = Math.sqrt(g.x * g.x);
    var y = Math.sqrt(g.y * g.y);

    // portrait -> landscape
    if(currentMode === 'portrait' && x > 8.5 && y < 1.5){
      currentMode = 'landscape';
      dsg.send({mode: currentMode});
    }

    // landscape -> portrait
    if(currentMode === 'landscape' && x < 1.5 && y > 8.5){
      currentMode = 'portrait';
      dsg.send({mode: currentMode});
    }
  };

  function floatConvertSyncer( num , dig ){
	  var p = Math.pow( 10 , dig ) ;
	  return Math.round( num * p ) / p ;
  };

};

