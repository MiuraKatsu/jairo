window.onload = function(){

  var image = document.getElementById('image');

  // app_idは自分のものに書き換えてください
  var milkcocoa = new MilkCocoa("blueilasdost.mlkcca.com");
  var dsg = milkcocoa.dataStore('gravity');
  var dsn = milkcocoa.dataStore('nine');

  dsg.on('send', changeViewFromSentMode);
  dsn.on('send', changeViewFromSentNine);

  function changeViewFromSentMode(sent){
    if(sent.value.mode === 'portrait'){
      image.className = '';
    }
    if(sent.value.mode === 'landscape'){
      image.className = 'is-landscape';
    }
  }

  function changeViewFromSentNine(sent){
	
	//if( typeof sent.value.mx !== "undefined"){
	//	console.log(sent.value);
	//}

	for(var k of Object.keys(sent.value)){
		var appendElement = document.getElementById(k);
		var newDiv = document.createElement("div");
		newDiv.innerHTML = floatConvertSyncer(sent.value[k],1);
		appendElement.appendChild(newDiv);
		childNodes = appendElement.childNodes;

        //20行の範囲でスクロールさせる
		if(childNodes.length > 20){
			appendElement.removeChild(childNodes[1]);
		}
	}

	//console.log(sent.value);
  }

  function floatConvertSyncer( num , dig ){
	  var p = Math.pow( 10 , dig ) ;
	  return Math.round( num * p ) / p ;
  };
};
