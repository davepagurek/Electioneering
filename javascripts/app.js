var _ = require("lodash");
var $ = require("jquery");
var tweets = require("./tweets.js");

var Stance = require("./ui/Stance.js");
var Opportunity = require("./ui/Opportunity.js");
var Person = require("./models/Person");
var Tweet = require("./ui/Tweet.js");

var parties = [
  {
    views: [0.5, -0.5]
  }
];

var people = {
  // ID of the square to list of people
  // square ID corresponds to metadata file as well as SVG element ids
  "x50y90" : [
    new Person({
      // may do this in JS on demand, it makes file bigger for little gain
      "name" : "Bob Jepsen",
      "age": 32,
      // corresponds with order in questions file
      "views": [0.2,0.9,-0.8,-0.1,0.8,0.4],
      // corresponds with the order in parties file, normalized to sum to 1
      "parties": [0.2,0.6,0.2]
    }),
  ]
};

function onChallengeAccepted() {
  // this = opportunity

  _.forIn(people, function(persons, location){
    var filter = this.filter.apply(this, [location]);
    _.filter(persons).forEach((person) => person.update(parties));
  }.bind(this));
}

function loadData() {
  $.getJSON( "data/people.json", function( data ) {
    people = _.mapValues(data, function(p) {
      return _.map(p, function(p){
        return new Person(p);
      });
    });
  });
  $.getJSON( "data/questions.json", function( data ) {
    data.forEach((stance, i) => $("#stances").append(new Stance(parties[0], stance.question, i).element));
  });
}

$(document).ready(function(){
  var svg = $("svg");
  $("rect").on("mouseover", function() {
    svg.append($(this));
  });

  loadData();

  setInterval(() => {
    let riding = _.sample(document.getElementsByClassName("sq"));
    svg.append($(riding));
    $("#game").append(new Tweet(
      _.sample(tweets).tweet,
      riding.id
    ).element);
  }, 5000);

  //Test thing
  setInterval(() => {
    $("#opportunities").append(Opportunity.generateOpportunity(onChallengeAccepted).element);
  }, 10000); 
});
