var http = require('http');
var apiHelper = require('../apiaiHelper.js');

var speakers;

var getAllSpeakers = function(callback){
  if(speakers){
    callback(speakers);
    return speakers;
  }
  var options = {
    host: 'cfp.devoxx.fr',
    path : "/api/conferences/DevoxxFR2017/speakers",
    //This is the only line that is new. `headers` is an object with the headers to request
    headers: {'User-Agent': 'BotDevoxxFr'}
  };
  http.get(options, function(res){
    const statusCode = res.statusCode;
    console.log("devoxx api - status code: " + statusCode);
    if(statusCode != 200){
      var error = apiHelper.createError(statusCode, 'Une erreur est survenue. Merci de ré-essayer!');
      if(callback){
        callback(error);
      }
      return error;
    }
    var rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
      try {
        var parsedData = JSON.parse(rawData);
        speakers = parsedData;
        if(callback){
          callback(speakers);
        }
        return parsedData;
      } catch (e){
        console.log(e);
        var error = apiHelper.createError(statusCode, 'Une erreur est survenue. Merci de ré-essayer!');
        if(callback){
          callback(error);
        }
        return error;
      }
    });
  }).on("error", function(e){
    console.log("Got error: " + e.message);
    var error = apiHelper.createError(statusCode, 'Une erreur est survenue. Merci de ré-essayer!');
    return error;
    });
};

var findSpeaker = function(firstName, lastName, callback){
  getAllSpeakers(function(speakers){
    var found = [];
    console.log("speakers:" + JSON.stringify(speakers))
    for(var i=0; i<speakers.length; i++){
      //Api.ai could be wrong on first/last name check all
      if(speakers[i].firstName.toLowerCase().includes(firstName.toLowerCase()) ||
        speakers[i].lastName.toLowerCase().includes(firstName.toLowerCase()) ||
        speakers[i].firstName.toLowerCase().includes(lastName.toLowerCase()) ||
        speakers[i].lastName.toLowerCase().includes(lastName.toLowerCase())){
        found.push(speakers[i]);
      }
    }
    var msg = apiHelper.findSpeakerResponse(found);
    callback(msg);
    return msg;
  });
};

var getSpeakerDetails = function(id, callback){
  var options = {
    host: 'cfp.devoxx.fr',
    path : "/api/conferences/DevoxxFR2017/speakers/"+id,
    //This is the only line that is new. `headers` is an object with the headers to request
    headers: {'User-Agent': 'BotDevoxxFr'}
  };
  http.get(options, function(res){
    const statusCode = res.statusCode;
    console.log("devoxx api getSpeakerDetails - status code: " + statusCode);
    if(statusCode != 200){
      var error = apiHelper.createError(statusCode, 'Une erreur est survenue. Merci de ré-essayer!');
      if(callback){
        callback(error);
      }
      return error;
    }
    var rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
      try {
        var parsedData = JSON.parse(rawData);
        if(callback){
          callback(parsedData);
        }
        return parsedData;
      } catch (e){
        console.log(e);
        var error = apiHelper.createError(statusCode, 'Une erreur est survenue. Merci de ré-essayer!');
        if(callback){
          callback(error);
        }
        return error;
      }
    });
  }).on("error", function(e){
    console.log("Got error: " + e.message);
    var error = apiHelper.createError(statusCode, 'Une erreur est survenue. Merci de ré-essayer!');
    return error;
    });
}

var createSpeech = function(data){
  var speech = 'Le temps à ' + data.name + ' est ' + data.weather[0].description
              + ' La température est de ' + data.main.temp + '°C.';
  return speech;
};



module.exports = {
  findSpeaker : findSpeaker,
  getSpeakerDetails : getSpeakerDetails
};
