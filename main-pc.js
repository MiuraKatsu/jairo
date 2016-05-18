window.onload = function(){

  var image = document.getElementById('image');

  // app_idは自分のものに書き換えてください
  var milkcocoa = new MilkCocoa("blueilasdost.mlkcca.com");
  var dsn = milkcocoa.dataStore('nine');

  var nine_data = {"gx": 0, "gy": 0, "gz": 0, "rx": 0, "ry": 0, "rz": 0, "mx": 0, "my": 0, "mz": 0}

  dsn.on('send', getNineData);

  function getNineData(sent){
	for(var k of Object.keys(sent.value)){
		nine_data[k] = floatConvertSyncer(sent.value[k],1);
    }
	//console.log(sent.value);
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
