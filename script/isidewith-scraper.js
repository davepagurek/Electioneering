
var cheerio = require("cheerio");
var rp = require("request-promise");
var _ = require("lodash");
var fs = require("fs");

var BASE_URL = "http://canada.isidewith.com"

function getUrl(url){
  console.log("Requesting " + url);
  return rp(url)
    .then(function(data){
      return cheerio.load(data);
    })
    .catch(console.error);
}

function getQuestions() {
  var result = {};
  return getUrl("http://canada.isidewith.com/polls")
    .then(function($){
      $(".poll").each(function(index){
        var poll = $(this);
        var question = poll.find(".question").text();
        var link = BASE_URL + poll.find("a").attr("href");
        console.log("question: %s, link: %s", question, link);

        result[question] = link;
      })
      return result;
    })
}

function getProvincialPollData(pollUrl){
  var provinces = {
    "ON": 9330440,
    "BC": 9332707,
    "AB": 9330206,
    "SK": 9330392,
    "MB": 9331878,
    "NB": 9330585,
    "NS": 9332216,
    "QC": 9331258,
    "NL": 9330414,
  };

  var provincialUrls = _.mapValues(provinces, function(value){
    return pollUrl + "/" + value;
  });

  var promises = [];

  _.forIn(provincialUrls, function(url, province){
    promises.push(Promise.all([Promise.resolve(province), getUrl(url)]));
  })

  var result = {
    "saidYes": {},
    "saidNo": {},
  };

  return Promise.all(promises)
    .then(function(data){
      data = _.zipObject(data);
      _.forIn(data, function($, province){

        var yes_result = parseFloat($(".yes_or_no .yes .perc").text()) / 100;
        var no_result = parseFloat($(".yes_or_no .no .perc").text()) / 100;
        console.log("yes: %d, no: %d", yes_result, no_result);

        result.saidYes[province] = yes_result;
        result.saidNo[province] = no_result;
      });
      return Promise.resolve(result);
    });
}

function main() {
  getQuestions()
    .then(function(questions){
      questions = _.pairs(questions).map(function(question){
        return Promise.all([Promise.resolve(question[0]), getProvincialPollData(question[1])]);
      })
      return Promise.all(questions)
    })
    .then(function(result){
      return Promise.resolve(_.map(result, function(element){
        var question = element[0];
        var saidYesNo = element[1];
        return _.assign({question: question}, saidYesNo);
      }));
    })
    .then(function(result){
      console.log(result);

      if (process.argv.length > 2) {
        var filename = process.argv[2];
        fs.writeFile(filename, JSON.stringify(result));
      }

      return result;
    })
    .catch(console.error);
}

main();
