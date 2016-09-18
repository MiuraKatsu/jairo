


window.onload = function(){


  var stage;

  //document.ready = function() {
    stage = d3.select("#d3graph").append("svg:svg").attr("width", $("#d3graph").width()).attr("height", 400);
    setInterval(updateGraph,100);
  //};
  //
  var colors = d3.scale.category10();
  var d3Line = d3.svg.line()
  .x(function(d,i){return i * 10})
  .y(function(d,i){return d });
  
  var points_gx = new Array();
  var points_gy = new Array();
  var points_gz = new Array();

  function updateGraph() {
    //points.push(Math.random() * 100 + 100);
    points_gx.push(nine_data["gx"] * 10 + 200);
    points_gy.push(nine_data["gy"] * 10 + 200);
    points_gz.push(nine_data["gz"] * 10 + 200);

    if(points_gx.length > $("#d3graph").width()/10) {
        points_gx.shift();
        points_gy.shift();
        points_gz.shift();
    }

    // 削除する
    stage.selectAll("path").remove();

    // 描画する
    stage.append("path")
    .attr("d", d3Line(points_gx))
    .attr("stroke", colors(0))
    .attr("fill", "none");

    stage.append("path")
    .attr("d", d3Line(points_gy))
    .attr("stroke", colors(1))
    .attr("fill", "none");

    stage.append("path")
    .attr("d", d3Line(points_gz))
    .attr("stroke", colors(2))
    .attr("fill", "none");

  }




    var connectOptions = {
      useSSL: true,
      timeout: 3,
      mqttVersion: 4,
      onSuccess: subscribe
    };
    client.connect(connectOptions);
    client.onMessageArrived = onMessage;
    client.onConnectionLost = function(e) { console.log(e) };


    function subscribe() {
      client.subscribe("nine");
      console.log("subscribed");
    }
    function onMessage(message) {
      getNineData(JSON.parse(message.payloadString));
      //r_output.innerHTML
      //= message.payloadString;
      //data.messages.push(message.payloadString);
      console.log("message received: " + message.payloadString);
    }


  //var image = document.getElementById('image');

  // app_idは自分のものに書き換えてください
  //var milkcocoa = new MilkCocoa("blueilasdost.mlkcca.com");
  //var dsn = milkcocoa.dataStore('nine');

  var nine_data = {"gx": 0, "gy": 0, "gz": 0, "rx": 0, "ry": 0, "rz": 0, "mx": 0, "my": 0, "mz": 0}

  //dsn.on('send', getNineData);

  function getNineData(sent){
	for(var k of Object.keys(sent)){
		nine_data[k] = floatConvertSyncer(sent[k],1);
    }
	//console.log(sent);
  }

  //1s毎に描画
  setInterval(changeViewFromNineData, 1000);

  function changeViewFromNineData(){
	
	for(var k of Object.keys(nine_data)){
		var appendElement = document.getElementById(k);
		var newDiv = document.createElement("div");
		newDiv.innerHTML = floatConvertSyncer(nine_data[k],1);
		appendElement.appendChild(newDiv);
		childNodes = appendElement.childNodes;

        //20行の範囲でスクロールさせる
		if(childNodes.length > 20){
			appendElement.removeChild(childNodes[1]);
		}
	}


  }

  //桁揃え
  function floatConvertSyncer( num , dig ){
	  var p = Math.pow( 10 , dig ) ;
	  return Math.round( num * p ) / p ;
  };
};
