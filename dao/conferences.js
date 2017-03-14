var http = require('http');
var apiHelper = require('../apiaiHelper.js');

var baseUrl = 'cfp.devoxx.fr';
var pathSchedule = '/api/conferences/DevoxxFR2017/schedules/'; //+ MonDAY || tuesday ||wednesday || thursday || friday
var pathType = '/api/conferences/DevoxxFR2017/proposalTypes/'; //+ conf || uni || tia || lab \\ bof || quick || key || ignite || other

var days = ['wednesday', 'thursday', 'friday'];

var conferences = [];
/**
*/
var getAllConferences = function(callback){
  if(conferences.length >0){
    callback(conferences);
    return conferences;
  }

  for(var i=0; i<days.length; i++){
    console.log("Calling conferences for " + days[i]);
    loadConferencesForADay(days[i], function(response, error){
      if(!error){
        console.log("adding " + response.length + " conferences for " +days[i]);
        conferences = conferences.concat(response);
        console.log('conferences contains ' + conferences.length);
      } else {
        console.log('Error loading day ' + days[i]);
      }
    });
    //TODO return all conference when loaded
  }
};

var loadConferencesForADay = function(day, callback){
  var path = pathSchedule+day;
  console.log("call url : " + path);
  // let's find all
  var options = {
    host: baseUrl,
    path : path,
    //This is the only line that is new. `headers` is an object with the headers to request
    headers: {'User-Agent': 'BotDevoxxFr'}
  };
  http.get(options, function(res){
    const statusCode = res.statusCode;
    console.log("conferences api - status code: " + statusCode);
    if(statusCode != 200){
      if(callback){
        callback(null, {});
      }
      return error;
    }
    var rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
      try {
        var parsedData = JSON.parse(rawData);
        console.log("found " + parsedData.slots.length + " conferences on " + day);
        if(callback){
          callback(parsedData.slots);
        }
        return parsedData.slots;
      } catch (e){
        console.log(e);
        if(callback){
          callback(null, e);
        }
        return e;
      }
    });
  }).on("error", function(e){
    console.log("Got error: " + e.message);
    callback(null, e);
    return error;
    });
};

var loadInCache = function(){
  getAllConferences(function(){
    console.log('conferences in cache called');
  })
};

var getConferencesByTheme = function(search, sender, callback){
  var found = [];
  console.log("Looking for conference about "+ search + " in " + conferences.length + " conferences");
  for(var i=0; i<conferences.length; i++){
    if(conferences[i].talk){
      if(conferences[i].talk.summary.toLowerCase().includes(search.toLowerCase())){
        found.push(conferences[i]);
      }
    }
  }
  var msg = apiHelper.findConfResponse(sender, found);
  callback(msg);
  return msg;
};


module.exports = {
  getConferencesByTheme : getConferencesByTheme,
  loadInCache : loadInCache
  //getConferencesByTime : getConferencesByTime,
  //getConferencesByRoom : getConferencesByRoom,

};
