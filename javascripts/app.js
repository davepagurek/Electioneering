var _ = require("lodash");
var $ = require("jquery");
var tweets = require("./tweets.js");

var Stance = require("./ui/Stance.js");
var Opportunity = require("./ui/Opportunity.js");
var Person = require("./models/Person");
var Tweet = require("./ui/Tweet.js");
<<<<<<< HEAD
var PersonUI = require("./ui/PersonUI.js");
=======
var Start = require("./ui/Start.js");
>>>>>>> Add party selector

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

var politician = {
  name: "David Hasselhoff",
  party: 0
};

var stances = null;

function onChallengeAccepted() {
  // this = opportunity

  _.forIn(people, function(persons, location){
    var filter = this.filter.apply(this, [location]);
    _.filter(persons, filter).forEach((person) => person.update(parties));
  }.bind(this));
}

function loadData() {
  $.getJSON( "data/parties.json", function( data ) {
    parties = data;
    $.getJSON( "data/people.json", function( data ) {
      people = _.mapValues(data, function(p) {
        return _.map(p, function(p){
          var p = new Person(p);
          p.update(parties, 1.0)
          return p;
        });
      });
    });
  });
  $.getJSON( "data/questions.json", function( data ) {
    stances = data;
  });
}

$(document).ready(function(){
  loadData();

  $("#game").append(new Start((party, name) => {
    politician.name = name;
    politician.party = _.find(parties, function(p) {
      return p.name.toLowerCase() == party;
    });

    $("rect").on("click", function() {
      var peopleList = people[$(this).attr("id")]
      var person = peopleList[Math.floor(Math.random()*peopleList.length)]
      var personUI = new PersonUI(person)

      $("#opportunities").append(personUI.element);
    })
    stances.forEach((stance, i) => $("#stances").append(new Stance(politician.party, stance.question, i).element));

    var svg = $("svg");
    $("rect").on("mouseover", function() {
      svg.append($(this));
    });

    // $("rect").on("click", function() {
    //   alert("You clicked a riding with " + people[$(this).attr("id")].length + " people.");
    // })


    setInterval(() => {
      let riding = _.sample(document.getElementsByClassName("sq"));
      svg.append($(riding));
      $("#opportunities").append(new Tweet(
        _.sample(tweets).tweet,
        riding.id
      ).element);
    }, 5000);

    //Test thing
    setInterval(() => {
      $("#opportunities").append(Opportunity.generateOpportunity(onChallengeAccepted).element);
    }, 20000);

  }).element);


});
