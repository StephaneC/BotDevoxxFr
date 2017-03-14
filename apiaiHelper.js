/**
 * This class create readable message for api.ai
 */
var defaultSource = 'Stéphane Castrec';

var findSpeakerResponse = function(sender, found){
  var msg;
  var facebook;
  if(!found || found.length ==0){
    msg = 'Je ne connais pas encore ce speaker ';
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
    console.log("message : " + JSON.stringify(msg));
    facebook = createCarouselMsg(sender, found, 'SPEAKER');

  }
  return createResponse(msg, msg, facebook);
};

var findConfResponse = function(sender, found){
  var msg = "";
  var facebook;
  if(!found || found.length ==0){
    msg = 'Je n\'ai pas trouvé de conférence sur ce sujet';
  } else {
    for(var i=0; i<found.length; i++){
      msg += 'J\'ai trouvé '+ found[i].talk.title+'. \n';
    }
    var facebook = createCarouselMsg(sender, found, 'CONFERENCES');

  }
  return createResponse(msg, msg, facebook);
};

var getSpeakerElementForCarousel = function(elt){
  var msg = {
    title:elt.firstName+' ' + elt.lastName,
    image_url:elt.avatarURL,
    subtitle:elt.company,
    buttons: []
  }
  //add button to talks
  for(var i=0; i<elt.acceptedTalks; i++){
    msg.buttons.push({
      type:"web_url",
      url:elt.acceptedTalks[i].links[0].href,
      title:elt.acceptedTalks[i].title
    })
  }

  return msg;
}

var getConfElementForCarousel = function(elt){
  var msg = {
    title:elt.title,
    subtitle:elt.track
  }

  return msg;
}

var createCarouselMsg = function(sender, list, type){
  var fbMsg = {
    recipient:{
      id:sender
    }
  };
  fbMsg.message= {
    attachment : {
      type:'template',
      payload :{
        template_type:'generic',
        elements: []
      }
    }

  };
  for(var i=0; i<list.length; i++){
    if(type == 'SPEAKER'){
      fbMsg.message.attachment.payload.elements.push(getSpeakerElementForCarousel(list[i]));
    } else {
      fbMsg.message.attachment.payload.elements.push(getConfElementForCarousel(list[i]));
    }
  }
  return fbMsg;
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

  var response = {
    speech : speech,
    displayText: message,
    data: {
      facebook: data
    },
    source:source
  };
  if(!source){
    response.source = defaultSource;
  }

  console.log("Sending message" + JSON.stringify(response));
  return response;
};
module.exports = {
  createError : createError,
  createResponse : createResponse,
  findSpeakerResponse: findSpeakerResponse,
  findConfResponse : findConfResponse
};
