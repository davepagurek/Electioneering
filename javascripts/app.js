var _ = require("lodash");
var $ = require("jquery");
var tweets = require("./tweets.js");

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
var squares = {};

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
  $.getJSON( "data/squares.json", function( data ) {
      squares = data;
  });
}

$(document).ready(function(){
  loadData();

  $("#game").append(new Start((party, name) => {
    politician.name = name;
    politician.party = _.find(parties, function(p) {
      return p.name.toLowerCase() == party;
    });

    tweets = tweets.map(function(tweet) {
      var newTweet = tweet.tweet.replace(/obama[\w]*/ig, politician.name);
      return {
        tweet: newTweet,
        positivity: tweet.positivity
      }
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
    }, 11000);

    //Test thing
    setInterval(() => {
      $("#opportunities").append(Opportunity.generateOpportunity(onChallengeAccepted).element);
    }, 20000);

  }).element);


});

var genCompany = function() {
    var a = ["The ", "Bob's ", "Amalgamated ", "Super ", "Terrestrial ", ""];
    var b = ["Hammer ", "Plier ", "Screwdriver ", "Combination Mill/Drill ", "Compound Radial Arm Saw ", "Free Software "];
    var c = ["Company", "Inc.", "LLC", "Limited", "Coop", "Empire", "Emporium"];
    return a[Math.floor(Math.random() * a.length)] + b[Math.floor(Math.random() * b.length)] + c[Math.floor(Math.random() * c.length)];
};

var getPoll = function() {
    var randSquare = function() {
        var x = Math.floor(Math.random() * 63);
        var y = Math.floor(Math.random() * 49);
        var sq = "x" + x + "y" + y;
        if (sq in squares) {
            return sq;
        }
        return randSquare();
    }

    var poll = {};
    poll.company = genCompany();
    var r;

    // Location
    poll.square = randSquare();
    var p = people[poll.square];
    var ppl = [];

    // Number of samples
    poll.n = 50000 + Math.floor(50000 * Math.random());

    // Poll methods:
    // * Phone // Biased age 18..90
    // * Online // Biased age 12..40
    // * Door to door // Biased 25..90
    // * Mail // Biased 50..90
    r = Math.random();
    if (r < 0.25) {
        poll.method = "Phone";
        poll.minAge = 18;
        poll.maxAge = 90;
    } else if (r < 0.5) {
        poll.method = "Online";
        poll.minAge = 12;
        poll.maxAge = 40;
    } else if (r < 0.75) {
        poll.method = "Door to door";
        poll.minAge = 25;
        poll.maxAge = 90;
    } else {
        poll.method = "Mail";
        poll.minAge = 50;
        poll.maxAge = 90;
    }

    for (var i = 0; i < p.length; i++) {
        if (poll.minAge <= p[i].age && p[i].age <= poll.maxAge) {
            ppl.push(p[i])
        }
    }

    if (ppl.length == 0) {
        return getPoll();
    }

    // Poll question
    // * Party affinity
    // * Specfic question (out of 38)
    r = Math.random();
    if (r < 0.2) {
        poll.type = "party";
        poll.parties = [0.0, 0.0, 0.0];
        for (var i = 0; i < poll.n; i++) {
            poll.parties[ppl[Math.floor(ppl.length * Math.random())].pollVote()]++;
        }
    } else {
        poll.type = "question";
        poll.question = Math.floor(38 * Math.random());
        poll.answer = 0.0;
        for (var i = 0; i < poll.n; i++) {
            if (ppl[Math.floor(ppl.length * Math.random())].views[poll.question] > 0) {
                poll.answer += 1.0;
            }
        }
    }
    return poll;
};

//Test thing
setInterval(() => {
    var poll = getPoll();
    if (!poll) {
        return;
    }
    $("#opportunities").append(
            (new Opportunity(poll.company + " has conducted a poll.", "View Results")).element);
}, 5000);
