// Jared Rodgers
// Main.js

'use strict';
// Loot Tables
class LootTable {
    constructor() {
        this.name = "foraging"

    }
}

// Constant Variables
const BASEGATHERRATE = 5000;
const MESSAGELEVEL = 5;
const DEBUG = true;

// Global Variables
let gameInterval;
let flags = {
    logMessages: true,
    foraging: false,
    chopping: false,
    resting: false,
}
let inventory = {};

///////////////
// Functions //
///////////////

// @param type {int}
// @param message {string}
function logmessage (type, message) {
    let level = '';
    if (type == 1) {
        if (!DEBUG){ return; }
        level = 'Debug: ';
    } else if (type == 2) {
        level = 'Info: ';
    } else if (type == 3) {
        level = 'Game: ';
    }
    console.log(level + message);
}

function updateInterval() {
    clearInterval(gameInterval);
    gameInterval = setInterval(update, BASEGATHERRATE);
}

function update() {
    // gathering
    gather();
    console.log(inventory);
    let item;
    for (item in inventory) {
        $("#inventory-body").text(item + ': x' + inventory[item]);
    }
    // reset Interval with new calculation
    logmessage(1,'Reseting Interval');
    updateInterval();
}

function gather() {
    if (flags.foraging) {
        logmessage(1, "Generating Forage Drop...");
        basicLootCheck();
    } else if (flags.chopping) {
        logmessage(1, "Generating Chopping Drop...");
        basicLootCheck();
    } else if (flags.resting) {
        logmessage(3, "ZZZ...");
    }
}

function basicLootCheck() {
    // replace with a weighed item based system
    let drop = Math.random() * 100;
    // items that drop will be replaced with loot tables
    // static values will be replaced with variable amounts
    // static names will be replaced for different item drops
    if (drop <= 70) {
        logmessage(3, "Found item");
        if ('item' in inventory) {
            logmessage(1, "Incrementing item in inventory.");
            inventory['item'] = inventory['item'] + 1;
        } else {
            logmessage(1, "New item. Adding to inventory.");
            inventory['item'] = 1;
        }
    } else {
        logmessage(3, "Found nothing");
    }
}

function forage() {
    logmessage(3, "Foraging...");
    updateInterval();
    // replace with function that only sets proper flag
    flags.foraging = true; 
    flags.chopping = false; 
    flags.resting = false; 
}

function chop() {
    logmessage(3, "Chopping Trees...");
    updateInterval();
    // replace with function that only sets proper flag
    flags.foraging = false; 
    flags.chopping = true; 
    flags.resting = false; 
}

function rest() {
    logmessage(3, "Resting...");
    // replace with function that only sets proper flag
    flags.foraging = false; 
    flags.chopping = false; 
    flags.resting = true; 
}

function setup() {
    logmessage(2, "Setup Running...");
    $('#forageBtn').click(forage);
    $('#choppingBtn').click(chop);
    $('#restingBtn').click(rest);
    logmessage(1, "Getting Loot Tables");
    $.getJSON('loottables/gathering.json', function(data) {
        alert(data);
        console.log(data);
    });
    logmessage(2, "Setup Complete!");
}

// Main
$(document).ready(function() {
    setup();
    gameInterval = setInterval(update, BASEGATHERRATE);
});
