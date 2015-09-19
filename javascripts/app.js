var _ = require("lodash");
var $ = require("jquery");

var Stance = require("./ui/Stance.js");
var Opportunity = require("./ui/Opportunity.js");

var politician = {
  opinions: []
};

var stances = [
  "Should corporations, unions, and non-profit organizations be allowed to donate to political parties?",
  "Should Canada switch to a proportional representation voting system?",
  "Should the federal government be able to monitor phone calls and emails?",
  "Should Canadian aboriginals receive more government funds?"
];

$(document).ready(function(){
  var svg = $("svg");
  $("rect").on("mouseover", function() {
    svg.append($(this));
  });

  stances.forEach((stance, i) => $("#stances").append(new Stance(politician, stance, i).element));

  //Test thing
  setTimeout(() => {
    $("#opportunities").append(new Opportunity(
      "A factory is shutting down in Southern Ontario, and half the town was laid off.",
      "Subsidize jobs in the area",
      () => alert("you pressed a thing")
    ).element);
  }, 1000);
});
