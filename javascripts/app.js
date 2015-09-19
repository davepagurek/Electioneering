var _ = require("lodash");
var $ = require("jquery");
var tweets = require("./tweets.js");
var squares = require("../data/squares");

var Stance = require("./ui/Stance.js");
var Opportunity = require("./ui/Opportunity.js");
var Person = require("./models/Person");
var Tweet = require("./ui/Tweet.js");
var PersonUI = require("./ui/PersonUI.js");
var Start = require("./ui/Start.js");

var parties = [
  {
    views: [0.5, -0.5]
  }
];

var people = {};

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

// 62 x 48

var randSquare = function() {
    var x = Math.floor(Math.random() * 63);
    var y = Math.floor(Math.random() * 49);
    var sq = "x" + x + "y" + y;
    if (sq in squares) {
        return sq;
    }
    return randSquare();
}

var getPoll = function() {
    var poll = {};
    var r;

    // Poll question
    // * Party affinity
    // * Specfic question (out of 38)
    r = Math.random();
    if (r < 0.2) {
        poll.type = "party";
    } else {
        poll.type = "question";
        poll.question = Math.floor(38 * Math.random());
    }

    // Poll methods:
    // * Phone // Biased age 18..90
    // * Online // Biased age 12..40
    // * Door to door // Biased 25..90
    // * Mail // Biased 50..90
    r = Math.random();
    if (r < 0.25) {
        poll.method = "Phone";
    } else if (r < 0.5) {
        poll.method = "Online";
    } else if (r < 0.75) {
        poll.method = "Door to door";
    } else {
        poll.method = "Mail";
    }
}
