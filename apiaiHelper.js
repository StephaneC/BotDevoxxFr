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


var createWinnersMessage = function(year, winnersList){
  var msg;
  if(!winnersList || winnersList.length ==0){
    msg = 'Je ne connais pas encore les winners de ' + year;
  } else {
    msg = 'Les winners '+ year + ' sont ';
    var orga;
    for(var i=0; i<winnersList.length; i++){
      orga = winnersList[i];
      if(orga.twitter){
        msg += '@'+orga.twitter;
      } else {
        msg += orga.name;
      }
      if(i != winnersList.length-1){
        msg += ', ';
      }
    }
  }
  return createResponse(msg, msg, winnersList);
}

var createJurysMessage = function(year, juryList){
  var msg = 'Les jurys sont ';
  if(!juryList  || juryList.length ==0){
    msg= 'Je ne connais pas les jurys de ' + year;
  } else {
    var orga;
    for(var i=0; i<juryList.length; i++){
      orga = juryList[i];
      if(orga.twitter){
        msg += '@'+orga.twitter;
      } else {
        msg += orga.name;
      }
      if(i != juryList.length-1){
        msg += ', ';
      }
    }
  }
  return createResponse(msg, msg, juryList);
}

var createOrgasMessage = function(juryList){
  var msg = 'Les orgas sont ';
  if(!juryList  || juryList.length ==0){
    msg= 'Je ne connais pas les orgas de cette année.';
  } else {
    var orga;
    for(var i=0; i<juryList.length; i++){
      orga = juryList[i];
      if(orga.twitter){
        msg += '@'+orga.twitter;
      } else {
        msg += orga.name;
      }
      if(i != juryList.length-1){
        msg += ', ';
      }
    }
  }
  return createResponse(msg, msg, juryList);
}

var createSponsorsMessage = function(sponsorsList){
  var msg = 'Les sponsors sont ';
  if(!juryList  || sponsorsList.length ==0){
    msg= 'Je ne connais pas les sponsors de cette année.';
  } else {
    var sponsor;
    for(var i=0; i<sponsorsList.length; i++){
      sponsor = sponsorsList[i];
      msg += sponsor.name;
      if(i != sponsorsList.length-1){
        msg += ', ';
      }
    }
  }
  return createResponse(msg, msg, sponsorsList);
}

var createMentorsMessage = function(type, mentorsList){
  var msg = 'Les mentors ' + type + ' sont ';
  if(!mentorsList || mentorsList.length ==0){
    msg= 'Je ne connais pas les mentors de cette année.';
  } else {
    msg = 'Les mentors ' + type + ' sont ';
    if(type){
      //we receive a tab
      var mentor;
      for(var i=0; i<mentorsList.length; i++){
        mentor = mentorsList[i];
        if(mentor.twitter){
          msg +=  '@'+mentor.twitter;
        } else {
          msg += mentor.name;
        }
        if(i != mentorsList.length-1){
          msg += ', ';
        }
      }
    } else {
      msg = "La liste des mentors est disponible ici. http://www.up.co/communities/france/brest/startup-weekend/10230 (Ou demande moi une compétence particulière)";
    }
  }

  return createResponse(msg, msg, mentorsList);
}

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
  findSpeakerResponse: findSpeakerResponse
};
