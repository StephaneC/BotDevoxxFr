var apiHelper = require('./apiaiHelper.js');
var conferencesDao = require('./dao/conferences.js');
var speakersDao = require('./dao/speakers.js');

var bodyParser = require('body-parser')
var express = require('express');
var app = express();

var http = require('http').Server(app);
var myApiKey = "MyAuthenticationTokenIsHereAndIWillFoundABetterLater";

/** understand JSON in body. */
app.use(bodyParser.json());

app.get('/speakers', function(req, res){
  speakersDao.findSpeaker("Mathieu", "ANCELIN", "", function (speakers){
    res.send(speakers);
  });
});

app.get('/conferences', function(req, res){
  conferencesDao.getConferencesByTheme("java", "", function (conferences){
    res.send(conferences);
  });
});

app.get('/speaker', function(req, res){
  speakersDao.getSpeakerDetails("928fb729aded7d9a2e1452ca269e0559e8cab7ff", function (speakers){
    res.send(speakers);
  });
});

app.get('/test', function(req, res){
  conferences.getConferences(2016, function (sponsorsList){
    res.send(apiHelper.createWinnersMessage(year, sponsorsList));
  });
});

// Endpoint for api.ai
app.post('/apiwebhook', function(req, res){
  res.set('Content-type', 'application/json');
  //check authentication
  if(req.headers.token != myApiKey){
    console.log("token inccorect : " + req.headers.token);
    res.statusCode = 401;
    res.send('error');
  } else {
    console.log("apiwebhook "+ JSON.stringify(req.body));
    var request = req.body;
    var sender = '';
    if(request.originalRequest && request.originalRequest.source == 'facebook'){
      sender = request.originalRequest.data.sender.id;
      console.log("fb sender " + sender);
    }
    if(request.result){
      console.log(request);
      switch (request.result.action) {
        case 'find_speaker':
            console.log("action.find_speaker " + request.result.parameters['given-name'] );
            if(request.result.parameters['given-name'] || request.result.parameters['first-name'] ||
              request.result.parameters['last-name']){
                speakersDao.findSpeaker(request.result.parameters['given-name'] ,
                  request.result.parameters['last-name'], sender, function (response){
                  res.send(response);
                });
            }
            break;
        case 'find_conference':
            console.log("action.find_conference");
            conferencesDao.getConferencesByTheme(request.result.parameters['conferences_keywords'], sender, function (response){
              res.send(response);
            });
            break;
        default:
          console.log("action default");
          searchApi.search(request.result.resolvedQuery, function(result){
            console.log("default search - result: "+ JSON.stringify(result));
            res.send(result);
          });
          break;
      }
    } else {
      var txt = 'Nous n\'avons pas compris votre question. Que vouliez vous dire?';
      var err = apiHelper.createError(500, txt);
      res.send(err);
    }
  }
});


app.get('/time', function(req, res){
  //check authentication
  res.send(JSON.stringify(new Date()));
});

http.listen(8080, function(){
  console.log('listening on *:8080');

  //load conferences in cache
  conferencesDao.loadInCache();
});


var getTime = function(cb){
  var date = new Date();
  var data = {};
  var speech =  'Il est ' + (date.getUTCHours() + 1) + ':' + date.getUTCMinutes() + ' et ' + date.getUTCSeconds() + " secondes.";
  var response = apiHelper.createResponse(speech, speech, data, 'Crédit Mutuel Arkéa');
  cb(response);
}
