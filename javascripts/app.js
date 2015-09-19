var _ = require("lodash");
var $ = require("jquery");

var Stance = require("./ui/Stance.js");

var politician = {
  opinions: []
};

var stances = [
  "Should corporations, unions, and non-profit organizations be allowed to donate to political parties?",
  "Should Canada switch to a proportional representation voting system?",
  "Should the federal government be able to monitor phone calls and emails?",
  "Should Canadian aboriginals receive more government funds?"
];

$(function(){
  stances.forEach((stance, i) => $("#stances").append(new Stance(politician, stance, i).element));
});
