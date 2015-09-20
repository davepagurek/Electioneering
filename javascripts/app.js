var _ = require("lodash");
var $ = require("jquery");
var tweets = require("./tweets.js");

var Stance = require("./ui/Stance.js");
var Opportunity = require("./ui/Opportunity.js");
var Person = require("./models/Person");
var Tweet = require("./ui/Tweet.js");
var PersonUI = require("./ui/PersonUI.js");
var Start = require("./ui/Start.js");
var Modal = require("./ui/Modal.js");

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
var squares = null;

// Load the Visualization API and the piechart package.
window.google.load('visualization', '1', {'packages':['corechart']});

function onChallengeAccepted() {
  // this = opportunity

  _.forIn(people, function(persons, location){
    var filter = this.filter.apply(this, [location]);
    _.filter(persons, filter).forEach((person) => person.update(parties));
  }.bind(this));
}

function runElection() {
  var results = Array.apply(null, new Array(parties.length)).map(() => {return 0;});
  _.forOwn(people, function(peeps, squareId) {
    var realWorldPop = squares[squareId]['pop'];
    var mult = realWorldPop / peeps.length;
    peeps.forEach((person) => {
      var vote = person.vote()
      results[vote] += mult;
    });
  });
  return _.map(results,Math.floor);
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
      // window.people = people;
      // window.peeps = _.flatten(_.values(people));
    });
  });
  $.getJSON( "data/questions.json", function( data ) {
    stances = data;
  });
  $.getJSON( "data/squares.json", function( data ) {
      squares = data;
  });
  $.getJSON( "data/squares.json", function( data ) {
    squares = data;
  });
}

$(document).ready(function(){
  loadData();
  window.runElection = runElection;

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

    setInterval(() => {
      $("#opportunities").append(Opportunity.generateOpportunity(onChallengeAccepted).element);
    }, 10000);

    setInterval(() => {
        var poll = getPoll();
        if (!poll) {
            return;
        }
        $("#opportunities").append(
                (new Opportunity(poll.company + " has conducted a poll.", "View Results", ()=>{
                    $("#modal-container").empty();
                    $("#modal-container").append(new Modal(poll.company + " poll", pollResult(poll)).element);
                    $("#modal-container .modal").modal("show");
                })).element);

                //(new Opportunity(poll.company + " has conducted " + poll.type + ".", "View Results", function() { viewPoll(poll); })).element);
    }, 10000);

    setInterval(() => {
        var poll = getPoll();
        if (!poll) {
            return;
        }
        $("#opportunities").append(
                (new Opportunity(poll.company + " has conducted a poll.", "View Results", ()=>{
                    $("#modal-container").empty();
                    $("#modal-container").append(new Modal(poll.company + " poll", pollResult(poll)).element);
                    $("#modal-container .modal").modal("show");
                    drawCharts(poll, $("#modal-container .modal"));
                    viewPoll(poll);
                })).element);

                //(new Opportunity(poll.company + " has conducted " + poll.type + ".", "View Results", function() { viewPoll(poll); })).element);
    }, 5000);

  }).element);


});

function genCompany() {
    var a = ["The ", "Bob's ", "Amalgamated ", "Super ", "Terrestrial ", ""];
    var b = ["Hammer ", "Plier ", "Screwdriver ", "Combination Mill/Drill ", "Compound Radial Arm Saw ", "Free Software "];
    var c = ["Company", "Inc.", "LLC", "Limited", "Coop", "Empire", "Emporium"];
    return a[Math.floor(Math.random() * a.length)] + b[Math.floor(Math.random() * b.length)] + c[Math.floor(Math.random() * c.length)];
};

function getPoll() {
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
    if (p.length < 4) {
        return getPoll();
    }
    var ppl = [];

    // Number of samples
    poll.n = 50000 + Math.floor(50000 * Math.random());

    // Poll types:
    // * Phone // Biased age 18..90
    // * Online // Biased age 12..40
    // * Door to door // Biased 25..90
    // * Mail // Biased 50..90
    r = Math.random();
    if (r < 0.25) {
        poll.type = "a phone poll";
        poll.minAge = 18;
        poll.maxAge = 90;
    } else if (r < 0.5) {
        poll.type = "an online poll";
        poll.minAge = 12;
        poll.maxAge = 40;
    } else if (r < 0.75) {
        poll.type = "a door to door poll";
        poll.minAge = 25;
        poll.maxAge = 90;
    } else {
        poll.type = "a mail poll";
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
        poll.question = Math.floor(stances.length * Math.random());
        poll.answer = 0.0;
        for (var i = 0; i < poll.n; i++) {
            if (ppl[Math.floor(ppl.length * Math.random())].views[poll.question] > 0) {
                poll.answer += 1.0;
            }
        }
    }
    return poll;
};

function pollResult(poll){

    // // Set a callback to run when the Google Visualization API is loaded.
    // window.google.setOnLoadCallback(drawChart);

    // // Callback that creates and populates a data table, 
    // // instantiates the pie chart, passes in the data and
    // // draws it.
    // function drawChart() {
    //   if (poll.type == "party"){
        
    //   }

    // }

    if (poll.type == "party"){

      return `
      <br>
      <div id="chart_div"></div>`;
    } else {
      return `Question: ${stances[poll.question].question}<br>
       <div id="chart_div"></div>`;
    }
}

function drawCharts(poll, modal) {
  var chart_div = modal.find("#chart_div").get(0);
  if (poll.type == "party"){
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Party');
    data.addColumn('number', 'Support');
    data.addRows([
      ['Liberal', poll.parties[0]],
      ['NDP', poll.parties[1]],
      ['Conservative', poll.parties[2]],
    ]);

    var options = {'title':'Poll results - By Party',
                     'width':400,
                     'height':300,
                    'colors': ['red', 'orange', 'blue']};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(chart_div);
    chart.draw(data, options);
  } else {
    // poll.type = question
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Response');
    data.addColumn('number', 'Support');
    data.addRows([
      ['Approve', poll.answer],
      ['Disapprove', poll.n - poll.answer]
    ]);

    var options = {'title':'Poll results - By Issue',
                     'width':400,
                     'height':300,
                    'colors': ['blue', 'red']};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(chart_div);
    chart.draw(data, options);
  }
}

function viewPoll(poll) {
    var k = $("#" + poll.square)[0];
    k.classList.add("highlight");
    setTimeout(() => {
        k.classList.remove("highlight");
    }, 10000);
    console.log(k);
    console.log(poll);
};
