/**
 * This class create readable message for api.ai
 */
var defaultSource = 'Stéphane Castrec';

var findSpeakerResponse = function(found){
  var msg;
  if(!found || found.length ==0){
    msg = 'Je ne connais pas encore les winners de ' + year;
  } else {
    if(found.length == 1){
      //found 1
      msg = 'J\'ai trouvé '+ found[0].firstName + ' ' + found[0].firstName;
      if(found[0].twitter){
         msg += '('+ found[0].twitter+')';
      }
      msg += '. Profils: '+ found[0].links[0].href;
    } else {
        msg = "";
        for(var i=0; i<found.length; i++){
          msg += 'J\'ai trouvé '+ found[0].firstName + ' ' + found[0].firstName+ ".";
        }
    }
  }
  return createResponse(msg, msg, found);
};

var findConfResponse = function(found){
  var msg = "";
  if(!found || found.length ==0){
    msg = 'Je n\'ai pas trouvé de conférence sur ce sujet';
  } else {
    for(var i=0; i<found.length; i++){
      msg += 'J\'ai trouvé '+ found[i].talk.title+'. \n';
    }
  }
  return createResponse(msg, msg, found);
};


var createError = function(statusCode, message){
  var response = {
    speech : message,
    displayText: message,
    data: {
      statusCode: statusCode,
      message : message
    },
    source:defaultSource
  };
  return response;
};
var createResponse = function(speech, message, data, source){
  if(!data){
    data = {};
  }
  data.slack = {
    text : message
  };
  var response = {
    speech : speech,
    displayText: message,
    data: data,
    source:source
  };
  if(!source){
    response.source = defaultSource;
  }

  return response;
};
module.exports = {
  createError : createError,
  createResponse : createResponse,
  findSpeakerResponse: findSpeakerResponse,
  findConfResponse : findConfResponse
};
