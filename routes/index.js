var express = require('express');
var router = express.Router();
require('node-import');
imports('config/index');

var RtmClient = require('@slack/client').RtmClient;
var MemoryDataStore = require('@slack/client').MemoryDataStore;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var token = process.env.SLACK_API_TOKEN || '';
var rtm = new RtmClient(token, {
    logLevel: 'error',
    dataStore: new MemoryDataStore()
});
rtm.start();

// Wait for the client to connect
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
    var user = rtm.dataStore.getUserById(rtm.activeUserId);
    var team = rtm.dataStore.getTeamById(rtm.activeTeamId);
    console.log('Connected to ' + team.name + ' as ' + user.name);
});

var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
// Responds to a message with a 'hello' DM
rtm.on(RTM_EVENTS.MESSAGE, function (message) {
    var user = rtm.dataStore.getUserById(message.user)
    var dm = rtm.dataStore.getDMByName(user.name);
    if (message.text == 'leave' || message.text == 'hello' || message.text == 'help' || message.text == 'hi' || message.text == 'helo' || message.text == 'hey') {
        if (message.text == 'leave') {
            rtm.sendMessage('you are not apply leave ' + user.name + '!', dm.id);
        } else if (message.text == 'hello' || message.text == 'hi' || message.text == 'helo' || message.text == 'hey') {
            rtm.sendMessage('hello ' + user.name + '!', dm.id);
        } else if (message.text == 'help') {
            rtm.sendMessage('These are the different options for you: \n 1. leave', dm.id);
        } else {
            rtm.sendMessage('invalid data' + user.name + '!', dm.id);
        }
    } else {
        rtm.sendMessage("I don't understand" + " " + message.text + ". " + "Please use 'help' to see all options" + '.', dm.id);
    }
});

//////////////////////when app is started it sends a mesage to shekhar  //////////////////////////
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;
// you need to wait for the client to fully connect before you can send messages
rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function () {
// This will send the message 'this is a test message' to the channel identified by id 'C0CHZA86Q'
    rtm.sendMessage('text : welcome,\n username: shekhar, \n your app is running now', config.shekhar_channelId, function messageSent() {
    });
});

module.exports = router;