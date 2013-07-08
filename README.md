speechJS
========

Simple webkitSpeechRecognition wrapper class. (Google Chrome ONLY!)

Usage:
-------------

Create new instance:
	var sr = new SpeechRecognition();

Add event handler:
	sr.on([Name of event],  function() {});

Set options
	sr.set([option_name], [value]);
or
	sr.set({
		[option_name] : [value],
		[option_name] : [value]
	});
	
Start:
	sr.start();
	
Stop:
	sr.stop();
	
Options:
-------------

* "language" | default: "en-US" : Default language. see https://github.com/GoogleChrome/webplatform-samples/blob/master/webspeechdemo/webspeechdemo.html#L138 for other languages  
* "continuous" | default: true : if false, speech recognition will end when the user stops talking, otherwise it keeps on recording until it is stopped manually
* "interimResults" | default: false : if false, the only results returned by the recognizer are final and will not change

Events:
-------------

* "starting" : Fiered when user starting speech recognition.
* "started" : Fiered when speech recognition is started.
* "stopping" : fiered when user stopping speech recognition.
* "stopped" : Fiered when speech recogniton is stopped.
* "optionschanged" : Fiered when user change speech recognition's settings.
* "error" : Fiered when an error occurs.
* "result" : Fiered when speech recognition got results.

Handle Error & Result events
-------------

Example:
	sr.on("error", function(e) {
		console.log("[SpeechRecognition]", "Error:", e);
	});
	
	sr.on("result", function(evt) {
		console.log("[SpeechRecognition]", "Result:", evt);
		
		for (var i = evt.resultIndex; i < evt.results.length; ++i) {
		  if (evt.results[i].isFinal) {
			output.value += evt.results[i][0].transcript +" | ";
		  } else {
			//evt.results[i][0].transcript; <-- Not fully recognized (alias: interim script)!
		  }
		}
		
	});