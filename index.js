require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.BOT_TOKEN
const url = process.env.MONGO_URL
const channelid = process.env.CHANNELID;
/*
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myobj = { UID: "Company New Inc", MsgID: "Highway 37" };
  var query = { UID: ""};
  query.UID = myobj.UID;
  //Find
  dbo.collection("Record").find(query).toArray(function(err, result) {
    if (err) throw err;
    if (result.length){
		//Found double post delete original message and dm user
		console.log("found double post");
	}
	else{
	  //Insert 
	dbo.collection("Record").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
	});
	}
	 db.close();
  });
});

*/



bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);

});

bot.on('message', msg => {
	if(msg.author.bot) return;
	if(!(msg.channel.id == channelid)) return;
	/* for checking deleted message
  	bot.channels.fetch('764091640305680385')
		.then(channel => {
			channel.messages.fetch('764092286660902943')
				.then(message => console.log(message.content))
				.catch(err => {
					console.log("message got deleted");
				});

		})
		.catch(console.error);
	*/ 
	
	//var reply = "https://discord.com/channels/694649038611546132/694649040952098817" + msg.id;
	
	MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("mydb");
		  var myobj = { UID: "", MsgID: "" };
		  var query = { UID: ""};
		  myobj.UID = msg.author.id;
		  myobj.MsgID = msg.id;
		  query.UID = myobj.UID;
  dbo.collection("Record").find(query).toArray(function(err, result) {
    if (err) throw err;
    if (result.length){
		//Found double post delete original message and dm user
		console.log(result);
		db.close();
		msg.delete();
		msg.author.send("You already have an existing post at https://discord.com/channels/592741221856706590/" + channelid + "/" + result[0].MsgID + ". Please edit it instead. ")
	}
	else{
	  //Insert 
	dbo.collection("Record").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
	db.close();
	});
	}
  });
	});
});