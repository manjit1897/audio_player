$(function() {
  audioPlayer.load();       //calling load() fxn which is stored in audioplayer var                     
  if (window['webkitSpeechRecognition']) {
    var speechRecognizer = new webkitSpeechRecognition();
    // recognition will not end when user stops speaking if set to true
    speechRecognizer.continuous = true;
    // process the request while the user is speaking
    // and their commands are final. Set to false by default
    speechRecognizer.interimResults = true;
    speechRecognizer.lang = "en-US";
    var currentCommands = ['play', 'stop', 'pause', 'next', 'previous'],
        results = [],
        timeoutSet = false;

    speechRecognizer.onresult = function (evt) {
      audioPlayer.toggleSpinner(true);
      results.push(evt.results);     //The push() method adds new items to the end of an array, and returns the new length.
      if (!timeoutSet) {
        setTimeout(function() {     //The setTimeout() method calls a function or evaluates an expression after a specified number of milliseconds.
          timeoutSet = false;
          results.reverse();       //The reverse() method reverses the order of the elements in an array.
          try {
            results.forEach(function (val, i) {   //The forEach() method calls a provided function once for each element in an array, in order.
              var el = val[0][0].transcript.toLowerCase();
              if (currentCommands.indexOf(el.split(" ")[0]) !== -1) {  //split() method is used to split a string into an array of substrings, and returns the new array.
                                                                    //indexOf() method tells index of
                speechRecognizer.abort();
                audioPlayer.processCommands(el);
                audioPlayer.toggleSpinner();
                results = [];
                throw new BreakLoopException;

              }
              if (i === 0) {
                audioPlayer.processCommands(el);
                speechRecognizer.abort();
                audioPlayer.toggleSpinner();
                results = [];
              }
            });
          }
          catch(e) {return e;}
        }, 3000)
      }

      timeoutSet = true;
    }
    speechRecognizer.onend = function () {
      speechRecognizer.start();
    }

    speechRecognizer.start();
  }
  else {
    alert("Your browser does not support the Web Speech API");
  }
});
