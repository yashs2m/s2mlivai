importScripts('decode.js');
var timestamp = 0;
var count = 0;
onmessage=function(details)
{
	var http = new XMLHttpRequest();
	timestamp = details.data.timestamp;
	//console.log(details.data.timestamp);
	var strlang=details.data.language;
	var uuid = details.data.uuid;
	var token = details.data.token;
	var userid = details.data.userid;
	var form = new FormData()||0;
	var file = blob;
	var uploader=new Uploader();
	var blob = uploader.blobToFile(details.data.data, "tmp_name.ogg");
	form.append('audio_file',blob,"tmp_name.ogg");
	form.append('app_rec_id', uuid);
	form.append('user', userid);
	var s='2016-03-01T11:22:33';
	form.append('start_time',s);
	s='2016-03-01T11:22:33';
	form.append('end_time', s);
	form.append('recording_index', 1);
	form.append('language', strlang);
	var url = "https://dev.liv.ai/liv_transcription_api/recordings/";
	var data = form;
	http.open("POST", url, true);
	http.setRequestHeader("Accept","*/*")
	http.setRequestHeader("Authorization", 'Token '+token);
	http.send(data);

	http.onreadystatechange = function() {//Call a function when the state changes.
		//console.log("hello counter:"+count+": "+http.responseText);
		count++;
		var wordCounter=0;
	    if(http.readyState == 4 && (http.status == 201 || http.status == 200)) {
	    	//console.log("hello counter:"+count+": "+http.responseText);
	        //var txt = JSON.stringify(http.responseText);
	        var response=JSON.parse(http.responseText);
	        if (response!=null && response!='' && response!=' ') {
	        	var s = " ";
	        	if(response.transcriptions[0])
					s = response.transcriptions[0].utf_text;
				
				if(s!=null && s!='' && s!=' '){
					// s = Base64DecodeUrl(s);
					// s = Base64.decode(s);
					//console.log(s+" "+response.app_rec_id);
					for(var looper=0;looper<s.length;looper++){
						if(s.charAt(looper)==' '){
							wordCounter++;
						}
					}
				}
				else{
					s = ' ';
				}
				var return_object={'id':response.app_rec_id,'text':s,'timestamp':timestamp,'wordCounter':wordCounter+1};
		        self.postMessage(return_object);
		        close();
	    	}
	    	else{
	    		close();
	    	}
	    }
	    else if(http.readyState == 4 && (http.status != 201 && http.status != 200))
	    {
	    	var return_object={'id':0,'text':"error",'timestamp':timestamp,'wordCounter':wordCounter+1};
	        self.postMessage(return_object);
	        close();
	    }

	}

	

	

};
var Uploader = function(){
	
};
Uploader.prototype.blobToFile=function(theBlob, fileName){
	//A Blob() is almost a File() - it's just missing the two properties below which we will add
	theBlob.lastModifiedDate = new Date();
	theBlob.name = fileName;
	return theBlob;
}
