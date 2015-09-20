
function constraint(min, max, num) {
  if (num > max) {
    return max;
  } else if (num < min) {
    return min;
  } else {
    return num;
  }
}

function averagify(array){
  var sum = 0;
  array.forEach(function(element){
    sum += element;
  })

  var result = [];

  return array.map(function(element){
    return element / sum;
  })
}

export default class Person {
  constructor(data) {
    this.name = data.name;
    this.age = data.age;
    this.views = data.views;

    this.parties = data.parties;
  }

  update(parties, importance = 0.5) {

    if (importance == 1.0 || this.parties === null || this.parties === undefined) {
      this.parties = Array.apply(null, new Array(parties.length)).map(() => {return 0;});
      importance = 1.0;
    }

    var likeness = Array.apply(null, new Array(parties.length)).map(() => {return 0;}); // [-1, 1]
    var max_likeness_per_issue = 1/this.views.length;

    parties.forEach((party, partyIndex) => {
      this.views.forEach((view, viewIndex) => {
        var partyView = party.views[viewIndex];
        var selfImportance = Math.abs(view); // [0,1] - describes how important this issue is
        var delta = Math.pow(partyView - view, 2) * selfImportance * 2; // [-2, 2]

        likeness[partyIndex] += max_likeness_per_issue * (1 - Math.abs(delta));

      });
    });

    likeness = likeness.map((element) => {
      return constraint(0,1,(element + 1) / 2);
    })

    var affinities = averagify(likeness);

    // Finally, reconcile affinities and this.parties based on importance
    this.parties = averagify(this.parties.map(function(element, index){
      var newAffinity = affinities[index];
      return element + (newAffinity - element)*importance;
    }));
  }

  pollVote() {
    var determiner = Math.random()
    var partyToVote = 0;
    this.parties.forEach(function(party, index){
      determiner -= party;
      if (determiner <= 0) {
        return;
      } else {
        partyToVote++;
      }
    })
    return partyToVote;
  }

  vote() {
    var maxAffinity = _.max(this.parties);
    return this.parties.indexOf(maxAffinity);
  }

};
