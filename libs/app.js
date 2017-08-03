var app = angular.module("LivSpeech", []);
app.directive("livspeech", function() {
    return {
    	restrict:'EA',
        template : ""+
        			"<div class='app'>"+ 
					"<input type='button'  name='saveForm' id='switcher' value='Start' class='submit' style='width:100px;'></input>"+ 
					"<p id='status'> Record</p>"+ 
					"<p class='Language-text'> Language</p>"+ 
					"<select class='language' id='language'>"+ 
					"<option value='HI'> Hindi</option>"+ 
					"<option value='EN'> English</option>"+ 
					"<option value='PB'> Punjabi</option>"+ 
					"<option value='KA'> Kannada</option>"+ 
					"<option value='BN'> Bengali</option>"+ 
					"<option value='TE'> Telugu</option>"+ 
					"<option value='GU'> Gujarati</option>"+ 
					"<option value='MR'> Marathi</option>"+ 
					"</select>"+ 
					"<img src='images/page-1.svg' class='waveImage'>"+ 
					"</div>",
		controller: function(){

		},	
		scope:{
			callback:'=',
			userid:'=',
			token:'='
		},
		link: function(scope,elm,attrs){
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
			recorder = new Recorder({
					monitorGain: 0,
					numberOfChannels: 1,
					bitRate: 48000,
					encoderSampleRate: 16000
				});
			var recorderAvailable=false;
			var recordingIndex=0;
			var intervalTable=[];
			var recorder;
			var recordedtext="";
			var typedtext="";
			var sessionstarttime=0;
			var sessionstoptime=0;
			var recordingstarttime=0;
			var recordingstoptime=0;
			var totalrecording=0;
			var wordCounter=0;
			var callback = scope.callback;
			console.log(callback);	
			var blobToFile=function(theBlob, fileName){
				//A Blob() is almost a File() - it's just missing the two properties below which we will add
				theBlob.lastModifiedDate = new Date();
				theBlob.name = fileName;
				return theBlob;
			}
			document.getElementById("switcher").addEventListener( "click", function clickEventHandler(){
				//console.log(1);
				if(switcher.value=='Start'){
					if(!recorderAvailable){
						////console.log("To start");
						window.AudioContext = window.AudioContext || window.webkitAudioContext;
						navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
					}
					recorder.start();
					recorderAvailable=true;
					sessionstarttime=new Date().getTime();
					recordingstarttime=new Date().getTime();
				}
				else if(switcher.value=='Pause'){
					recorderAvailable=false;
					recorder.pause();		
					sessionstoptime=new Date().getTime();
					recordingstoptime=new Date().getTime();	
					totalrecording=totalrecording+(recordingstoptime-recordingstarttime);
					var temp=Math.round(totalrecording/1000);
					var hours = ("0"+(parseInt( temp / 3600 )%24)).slice(-2);
			    	var minutes = ("0"+(parseInt( temp / 60 )%60)).slice(-2);
			    	var seconds = ("0"+(temp%60)).slice(-2);
			    	var sessionrecording=(sessionstoptime-sessionstarttime);
			    	temp=Math.round(sessionrecording/1000);
			    	var hours = ("0"+(parseInt( temp / 3600 )%24)).slice(-2);
			    	var minutes = ("0"+(parseInt( temp / 60 )%60)).slice(-2);
			    	var seconds = ("0"+((temp%60))).slice(-2);
				}
				else if(switcher.value=='Resume'){
					recorder.resume();
					app_rec_idQueue = [];
					recorderAvailable=true;
					recordingstarttime=new Date().getTime();
					sessionstarttime=new Date().getTime();
					var myNode = document.getElementById("id");
					while (myNode.firstChild) {
					    myNode.removeChild(myNode.firstChild);
					}
				}
			});
			window.onclose = function()
			{
				recorder.stop();
			}	    
			recorder.addEventListener( "start", function(e){
				//console.log("chala");
				document.getElementById("status").innerHTML="Recording...";
				switcher.value='Pause';
				recordingIndex++;
				var interval = setInterval(function(){
					recorder.pause();
				}, 3000);
				intervalTable.push(interval);
			});

			recorder.addEventListener( "pause", function(e){
				document.getElementById("status").innerHTML="Record";
				for(var loop=0;loop<intervalTable.length;loop++){

					clearInterval(intervalTable[loop]);
				}
				if(!recorderAvailable){
					//console.log("inside pause");
					switcher.value='Resume';
					recorder.pause();
				}
			});

			recorder.addEventListener( "resume", function(e){
				//console.log("inside resume");
				document.getElementById("status").innerHTML="Recording...";
				switcher.value='Pause';
				recordingIndex++;
				var interval = setInterval(function(){
					stopSwitch=false;
					recorder.pause();
				}, 3000);
				intervalTable.push(interval);
			});

			recorder.addEventListener( "duration", function(e){
			});

			recorder.addEventListener( "streamError", function(e){
				//document.getElementById(".fadeMe").style.display = 'block'; 
			});

			recorder.addEventListener( "streamReady", function(e){
				//$(".fadeMe").hide();
			});

			recorder.addEventListener( "dataAvailable", function(data){
				var uploader=new Worker("libs/Uploader.js");
				var e = document.getElementById("language");
				var strlang = e.options[e.selectedIndex].value;	
				//if(data.detail.length>200)
				var uuid = generateUUID()||0; 
				uploader.postMessage({"data":data.detail,
						"language":strlang,
						"timestamp":data.timeStamp,
						"uuid":uuid,
						"token":scope.token,
						"userid":scope.userid
					});
				uploader.addEventListener('message', function(e) {
					//console.log(e.data.id+" "+e.data.text);
					if(e.data.id==0){
					}
					else{
						console.log(callback);
						var textarea = document.getElementById(callback);
						textarea.value=textarea.value+" "+e.data.text;
						wordCounter+=e.data.wordCounter;
						textarea.scrollTop=textarea.scrollHeight;
						//console.log(app_recQueue);
					}
				}, false);

				if(recorderAvailable){
					recorder.resume();
					//console.log(1);			
				}
				else{
					//console.log(2);
				}
				if(recorder.state!="recording"){
				}
				else{
				}
			});
			recorder.initStream();
		}	

    };
});
