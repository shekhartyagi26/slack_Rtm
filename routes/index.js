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
    rtm.sendMessage('Hello ' + user.name + '!', dm.id);
});

//////////////////////use for sending message //////////////////////////
var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;
// you need to wait for the client to fully connect before you can send messages
rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function () {
    // This will send the message 'this is a test message' to the channel identified by id 'C0CHZA86Q'
    rtm.sendMessage('this is a test message', config.shekhar_channelId, function messageSent() {
        // optionally, you can supply a callback to execute once the message has been sent
    });
});


var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
rtm.on(RTM_EVENTS.MESSAGE, function (message) {
    // Listens to all `message` events from the team
});
rtm.on(RTM_EVENTS.CHANNEL_CREATED, function (message) {
    // Listens to all `channel_created` events from the team
});

module.exports = router;