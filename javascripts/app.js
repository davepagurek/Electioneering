let _ = require("lodash");
let $ = require("jquery");

let Stance = require("./ui/Stance.js");

let politician = {
  opinions: []
};

let stances = [
  "Should corporations, unions, and non-profit organizations be allowed to donate to political parties?",
  "Should Canada switch to a proportional representation voting system?",
  "Should the federal government be able to monitor phone calls and emails?",
  "Should Canadian aboriginals receive more government funds?"
];

$(function(){
  stances.forEach((stance, i) => $("#stances").append(new Stance(politician, stance, i).element));
});
