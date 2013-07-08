/**
 * webkitSpeechRecognition Wrapper class.
 * Created by: Daniel Hodvogner, <daniel@hodvogner.hu>
 * Feel free to use =).
 **/
 
function SpeechRecognition() {
	var self = this;
	
	self.recognition = null;
	self.options = {
		language      : "en-US", //Default language. see https://github.com/GoogleChrome/webplatform-samples/blob/master/webspeechdemo/webspeechdemo.html#L138 for other languages  
		continuous    : true,    //if false, speech recognition will end when the user stops talking, otherwise it keeps on recording until it is stopped manually
		interimResults: false,   //if false, the only results returned by the recognizer are final and will not change
	}
	
	/** Private Methods **/
	
		/**
		 * Constructor
		 **/
		self._create = function() {
			if(typeof window.webkitSpeechRecognition != "undefined") {
				if(self.recognition != null) return;
				self.recognition = new webkitSpeechRecognition();
				self._set();
				
				//Events
				self.recognition.onresult       = self._handleOnResult;
				self.recognition.onstart        = function() { self.fire("start"); self.fire("started");  }
				self.recognition.onend          = function() { self.fire("stop");  self.fire("stopped");  }
				self.recognition.onerror = function(evt) {
					//evt.error == 'no-speech'     //Can't recognize anything.
					//evt.error == 'audio-capture' //No microphone.
					//evt.error == 'not-allowed'   //User denied the access of their microphone.
					self.fire("error", evt.error);
				}
				
			} else {
				var msg = "Cannot access the speech recognition API. Are you using Google Chrome 25 or higher?"
				console.error(msg); throw new Error(msg);
			}
		}

		/**
		 * Apply options to SpeechRecognition instance if it isn't null.
		 **/
		self._set = function() {
			if(self.recognition == null) return;
			self.recognition.continuous     = self.options.continuous;
			self.recognition.interimResults = self.options.interimResults;
			self.recognition.lang           = self.options.language; 
		}
		
		/**
		 * SpeechRecognition.onresult event handler.
		 **/
		self._handleOnResult = function(evt) {
			//@DEBUG console.log("_handleOnResult:", evt, this, self);
			self.fire("result", evt);
		}
	
	/** Public Methods **/
	
		/**
		 * Set options, and apply if it possible.
		 **/
		self.set = function(params, value) {
			if(typeof params != "object") {
				self.options[params] = value;
			} else {
				for( name in params) {
					self.options[name] = params[name];
				}
			}
			self.fire("optionschanged");
		}

		/**
		 * Start Speech Recognition.
		 **/
		self.start = function() {
			if(self.recognition == null) self._create();
			self.recognition.start();
			self.fire("starting");
		}

		/**
		 * Stop Speech Recognition.
		 **/
		self.stop = function() {
			if(self.recognition == null) return;
			self.recognition.stop();
			self.fire("stopping");
		}
	
	/** +--------------------------------+
     *  |            Callbacks           |
	 *  +--------------------------------+ 
	 **/
	self._events = {};
	
	self.on = function(eventName, callback) {
		self._events[eventName] = self._events[eventName] || [];
		self._events[eventName].push(callback);
	};
	
	self.fire = function(eventName, _) {
		var events = self._events[eventName];
		var args = Array.prototype.slice.call(arguments, 1);
		if (!events) return;
		for (var i = 0, len = events.length; i < len; i++) events[i].apply(null, args);
	};
	
}