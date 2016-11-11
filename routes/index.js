var express = require('express');
var moment = require('moment');
var router = express.Router();
const leave_status = require('../service/leave/status');
var leave = require('../service/leave/apply');
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

rtm.on(RTM_EVENTS.MESSAGE, function (message) {
    var time = moment().format('h:mm:ss');
    var user = rtm.dataStore.getUserById(message.user)
    if (user == undefined) {
        return;
    }
    var dm = rtm.dataStore.getDMByName(user.name);
    if (dm == undefined) {
        return;
    }
    var dateFormat = "DD-MM-YYYY";
    var date = moment(message.text, dateFormat, true).isValid();
    if (message.text == 'hello' || message.text == 'hi' || message.text == 'helo' || message.text == 'hey') {
        rtm.sendMessage('hello ' + user.name + '!', dm.id);
    } else if (message.text == 'leave') {
        rtm.sendMessage('These are the different options for you: \n 1. apply \n 2. status', dm.id);
    } else if (message.text == 'help') {
        rtm.sendMessage('These are the different options for you: \n 1. leave', dm.id);
    } else if (message.text == 'status') {
        leave_status.fetch(message, dm, rtm, function (req, response, msg) {
        });
    } else if (message.text == 'apply' || date == true || date == false) {
        var id = message.user;
        leave._apply(message, dm, id, date, time, rtm, user);
    } else if (dm && dm.id) {
        rtm.sendMessage("I don't understand" + " " + message.text + ". " + "Please use 'help' to see all options" + '.', dm.id);
    }
});

module.exports = router;