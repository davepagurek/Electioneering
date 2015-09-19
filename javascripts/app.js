var _ = require("lodash");
var $ = require("jquery");

var Stance = require("./ui/Stance.js");
var Opportunity = require("./ui/Opportunity.js");
var Person = require("./models/Person");

var parties = [
  {
    views: [0.5, -0.5]
  }
];

var stances = [
  "Should corporations, unions, and non-profit organizations be allowed to donate to political parties?",
  "Should Canada switch to a proportional representation voting system?",
  "Should the federal government be able to monitor phone calls and emails?",
  "Should Canadian aboriginals receive more government funds?"
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
    persons.filter(filter).forEach((person) => person.update(parties));
  }.bind(this));
}

$(document).ready(function(){
  var svg = $("svg");
  $("rect").on("mouseover", function() {
    svg.append($(this));
  });

  parties.forEach((party) => {
    stances.forEach((stance, i) => $("#stances").append(new Stance(party, stance, i).element));
  })

  //Test thing
  setInterval(() => {
    $("#opportunities").append(Opportunity.generateOpportunity(onChallengeAccepted).element);
  }, 10000); 
});
