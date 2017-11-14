var express = require('express');
var router = express.Router();

var request = require('request');
var config = require('../config/config.json');

var User = require('../models/user.js');

var FBBotFramework = require('fb-bot-framework');


function fbRequestAccessToken(callback){

  console.log("FB REQUEST ACCESS TOKEN ");

	var url = 'https://graph.facebook.com/v2.6/oauth/access_token?client_id='+config.fb.appid+'&client_secret='+config.fb.appsecret+'&grant_type=client_credentials';

	request(url, function (error, response, body) {
	  	if(error){
	  		console.log(error);
	  		callback(error,null);
	  	} 
	  	if (response.statusCode == 200) {
	  		var body = JSON.parse(response.body);
	    	callback(null, body.access_token);
	  	} else {
	  		callback('Authentication failed. Try again',null);
	  	}

	});
};

function silentBot(userid, callback){

  console.log("BOT SILENCIADO!");

  if(userid){
     callback("no userid found",null);
  }

  User.findOne({ fb_id: userid }, function (err, user) {
      if (err) {
        callback(err,null);
      }

      if(!user){
             
        callback("no user found",null);              

      } else {
        user.bot_status = false;
        user.updated = Date.now();
        user.save();
        callback(null,user);
      }     

  });

};


function requestUser(userid, callback){

  console.log("REQUEST USER");

	User.findOne({ fb_id: userid }, function (err, user) {
	    if (err) {
	  		callback(err,null);
	    }

	    if(!user){

		  	fbRequestAccessToken(function(err,token){
  		    	if(err){
  		    		callback({message:'Internal Server Error'},null);
  		    	} else {

  		    		var url = 'https://graph.facebook.com/v2.6/'+userid+'?access_token='+token;

  		    		request(url, function (error, response, body) {
  		    		  	if(error){
  		    		  		console.log(error);
  		    		  		callback(error,null);
  		    		  	} 
  		    		  	if (response.statusCode == 200) {
  		    		  		
  		    		  		var u = JSON.parse(response.body);
  		    		    	
  		    		    	var newuser = new User({
  		    		    		name: u.name,  
  		    		    	    fb_id: u.id   		    		    	    
  		    		    	});

  		    		    	newuser.save(function(err,un) {
  		    		    	    if(!err) {
  		    		    	        console.log('New user has been created'); 
  		    		    	        callback(null, un);                
  		    		    	    } else {
  		    		    	        console.log('ERROR: ' + err);
  		    		    	        callback(err, null);
  		    		    	    }
  		    		    	});

  		    		    	
  		    		  	} else {
  		    		  		callback('Authentication failed. Try again',null);
  		    		  	}

  		    		});
  		    		
  		    	}
  		    });    

		} else {
			callback(null,user);
		} 		

	});

};

function createUser(userid, callback){

  console.log("CREATE USER");

  if(userid){
     callback("no userid found",null);
  }

  User.findOne({ fb_id: userid }, function (err, user) {
      if (err) {
        callback(err,null);
      }

      if(!user){
             
            var newuser = new User({
              name: "userhasnoname",  
              fb_id: userid                         
            });

            newuser.save(function(err,un) {
                if(!err) {
                    console.log('New user has been created'); 
                    callback(null, un);                
                } else {
                    console.log('ERROR: ' + err);
                    callback(err, null);
                }
            });                

    } else {
      callback(null,user);
    }     

  });


};


// generic function sending messages
function sendMessage(recipientId, message) {
    console.log("sendmessage");
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

/*
 * Call the Send API. The message data goes in the body. If successful, we'll 
 * get the message id in a response 
 *
 */
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
      messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      /*console.error(response);
      console.error(error);*/
    }
  });  
}


/*
 * 1) Send initial message.
 *
 */
function sendInitialMessage(recipientId) {
  console.log("SEND INITIAL MESSAGE");
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Hei! Så, du trenger en gave? 🎁 Vi har de beste gavealternativene fra vår partnere i Norge 👌💡 eller vi finner andre flotte gaver fra resten av universet når du trenger dem! 👨‍🚀 Velg eller se mer av våre tjenester, helt uforpliktende!😃",
          buttons:[{
            type: "postback",
            title: "Jeg trenger en gave",
            payload: "nei_hjelp_meg"
          },{
            type: "postback",
            title: "Gaveinnpakkning",
            payload: "ja_jeg_har_en_ide"
          },
          {
            type: "postback",
            title: "Gaveplanlegger",
            payload: "mer_info"
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
}

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message' 
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference#received_message
 *
 * For this example, we're going to echo any text that we get. If we get some 
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've 
 * created. If we receive a message with an attachment (image, video, audio), 
 * then we'll simply confirm that we've received the attachment.
 * 
 */
function receivedMessage(event) {

  console.log("RECEIVED MESSAGE");
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
  senderID, recipientID, timeOfMessage);
  //console.log(JSON.stringify(message));

  var messageId = message.mid;

  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches any special
    // keywords and send back the corresponding example. Otherwise, just echo
    // the text we received.
    switch (messageText) {
      case 'personalizado':
        sendPersonalMessage(senderID);
        break;

      default:
        sendInitialMessage(senderID);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message. Read
 * more at https://developers.facebook.com/docs/messenger-platform/webhook-reference#postback
 * 
 */
function receivedPostback(event, user) {

    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    var payload = event.postback.payload;

    console.log("recipient:"+recipientID);
    console.log("sender:"+senderID);
     
    switch (payload){
      
      case 'ja_jeg_har_en_ide':
        silentBot(senderID, function (err, user){
         
        });        
        ja_jeg_har_en_ide_Message(senderID);
        break;

      case 'mer_info':
        mer_info_Message(senderID);
        break;

      case 'nei_hjelp_meg':
        silentBot(senderID, function (err, user){
          
        });
        nei_hjelp_meg_Message(senderID);        
        break;

      case 'okei_jeg_er_klar':
        silentBot(senderID, function (err, user){
          
        });
        okei_jeg_er_klar_Message(senderID);
        break;

      case 'takk_kanskje_senere':
        takk_kanskje_senere_Message(senderID);
        break;

      case 'jeg_vil_vite_mer':
        jeg_vil_vite_mer_Message(senderID);
        break;

      default:
        sendInitialMessage(senderID, messageText);
    }

    
    
   
}


/*
 * 1.1 
 */
function nei_hjelp_meg_Message(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: 'Skriv noen om hvem, hva og hvor mye du tenker å kjøpe for 💬 Jo mer informajon, jo raskere og mer effektivt kan assistenten din hjelpe deg! 🙂 (Alder, kjønn, anledning, interesser, budsjett...) Alt hjelper slik at assistenten kan finne frem til den beste gaven til julaften 🎅'
    }
  };

  callSendAPI(messageData);
}


/*
 * 1.2 
 */
function ja_jeg_har_en_ide_Message(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: 'Har du lyst til å gi en gave fra sofaen? Vi kan pakke inn, skrive kort og sende gaven direkte til mottaker🙂 Send oss en melding hvis du har noen spørsmål anngående gaveinnpakning. '
    }
  };

  callSendAPI(messageData);
}

/*
 * 1.3
 */
function mer_info_Message(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Vi kan hjelpe deg med å lage en handeliste eller få påminnelser for alle gavene du skal gi. Skriv inn informasjonen om venner og familie du skal kjøpe gave til. Fortell oss når du trenger gaven, så sender vi deg en påminnelse med forslag til hva du kan kjøpe! 🙂",
          buttons:[{
            type: "postback",
            title: "Lag handleliste!",
            payload: "okei_jeg_er_klar"
          },{
            type: "postback",
            title: "Få påminnelser",
            payload: "takk_kanskje_senere"
          },
          {
            type: "postback",
            title: "Jeg vil vite mer",
            payload: "jeg_vil_vite_mer"
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
}

/*
 * 2.1
 */
function okei_jeg_er_klar_Message(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: 'Supert! Klikk på linken under og du vil begynne å lage din handleliste. https://glimty2.typeform.com/to/Q2kSkT 🎁 '
    }
  };

  callSendAPI(messageData);
}

/*
 * 2.2
 */
function takk_kanskje_senere_Message(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: 'Supert! Klikk på linken under og lag en påminnelse for når du trenger en gave 🎁 https://glimty4u.typeform.com/to/uKRrvX'
    }
  };

  callSendAPI(messageData);
}

/*
 * 2.3
 */
function jeg_vil_vite_mer_Message(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: 'Det er bare å stille oss spørsmål her, eller ta en kikk på FAQ-siden vår for mer informasjon :) https://glimty.com/faq'
    }
  };

  callSendAPI(messageData);
}





router.route('/')
	.get(function (req, res) {
	    res.send('This is TestBot Server');
	});

router.route('/token')
	.get(function (req, res) {
	    fbRequestAccessToken(function(err,token){
	    	if(err){
	    		res.status(500).json({message:'Internal Server Error'});
	    	} else {
	    		console.log(token);
	    		res.status(200).json({token:token});
	    	}
	    });    
	});

router.route('/user/:id')
	.get(function (req, res) {
	    requestUser(req.params.id, function(err,user){
	    	if(err){
	    		res.status(500).json({message:'Internal Server Error'});
	    	} else {
	    		res.status(200).json({user:user});
	    	}
	    });    
	});

router.route('/webhook')
	.get( function (req, res) {
	    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
	        res.send(req.query['hub.challenge']);
	    } else {
	        res.send('Invalid verify token');
	    }
	})
	.post( function (req, res) {
      console.log("WEBHOOK");
      

            var events = req.body.entry[0].messaging;
            for (i = 0; i < events.length; i++) {
              var event = events[i];
                console.log("receipent1:"+event.recipient.id);
                console.log("sender1:"+event.sender.id);
                if (event.message && event.message.text && event.sender.id != "1033228360033337") {                  
                  createUser(event.sender.id, function (err , user){
                    
                    if(user){
                      if(user.bot_status && event.message.text!='Hei Glimty'){
                        user.updated = Date.now();
                        user.userlast = event.message.text;
                        user.save();
                        sendInitialMessage(event.sender.id);
                      } else if(!user.bot_status && event.message.text=='Hei Glimty'){
                        user.bot_status = true;
                        user.userlast = event.message.text;
                        user.updated = Date.now();
                        user.save();
                      }

                    } else {
                      console.log("NO USER FOUND 1");
                    }                 
                  });                   
                } else if (event.postback && event.sender.id != "1033228360033337") {
                  console.log("postback");
                  console.log(event);
                  createUser(event.sender.id, function (err , user){
                    if(user){
                      if(user.bot_status){
                        user.updated = Date.now();
                        user.userlast = event.postback.payload;
                        user.save();
                        console.log("SECOND");  
                        console.log("receipent2:"+event.recipient.id);
                        console.log("sender2:"+event.sender.id);
                        receivedPostback(event, user);
                      }
                    } else {
                      console.log("NO USER FOUND 2");
                    }
                  });
                } else if(event.message && event.message.text && event.sender.id == "1033228360033337") {

                  createUser(event.recipient.id, function (err , user){
                    if(user){
                      if(user.bot_status && event.message.text!='Tusen takk for at du kjøpte gave hos Glimty 🙌. Vi håper du er like fornøyd som oss! Husk, vi er alltid på plass for å hjelpe deg med å finne den neste gaven.🎁'){
                        user.updated = Date.now();
                        user.botlast = event.message.text;
                        user.save();  

                        if(event.message.text == 'Du har nå blitt koblet til en gaveassistent! Hva kan jeg hjelpe deg med? 🙂' ){
                          user.bot_status = false;
                          user.save();
                        } 

                      } else if(!user.bot_status && event.message.text=='Tusen takk for at du kjøpte gave hos Glimty 🙌. Vi håper du er like fornøyd som oss! Husk, vi er alltid på plass for å hjelpe deg med å finne den neste gaven.🎁'){
                        user.bot_status = true;
                        user.updated = Date.now();
                        user.botlast = event.message.text;
                        user.save();
                      } 

                    } else {
                      console.log("NO USER FOUND 3");
                    }                 
                  }); 

                  
                }

            }
            res.sendStatus(200);
	    
	});

module.exports = router;