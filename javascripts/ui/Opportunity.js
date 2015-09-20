var $ = require("jquery");

export default class Opportunity {
  constructor(question, action, callback = function(){}, importance = 0.5, squares = null) {
    this.element = $(
      `
      <div class="opportunity animated bounceIn">
        <button class="close">
          <i class="fa fa-times"></i>
        </button>
        <h3></h3>
        <button class="opportunity_do"></button>
      </div>
      `
    );
    this.element.find(".close").on("click", () => {
      this.remove();
    });
    this.element.find(".opportunity_do").text(action).on("click", () => {
      callback.apply(this);
      this.remove();
    });
    this.element.on("mouseleave", () => {
      this.setTimer();
    });
    this.element.on("mouseover", () => {
      clearTimeout(this.timer);
    });
    this.setTimer();
    this.element.find("h3").text(question);
    this.importance = importance;
    this.squares = squares;
  }

  setTimer() {
    this.timer = setTimeout(() => {
      this.remove();
    }, 10000);
  }

  remove() {
    this.element.stop().animate({
      "height": "0px",
      "margin-top": "0px",
      "margin-bottom": "0px",
      "padding-top": "0px",
      "padding-bottom": "0px"
    }, 400, () => this.element.remove());
  }
  static generateOpportunity(callback = function(){}) {
    var rallyLocations = [
      {
        name: "Toronto",
        squares: [
          "x43y46",
          "x44y46",
          "x45y46",
          "x43y47",
          "x44y48"
        ],
      },
      {
        name: "Calgary",
        squares: [
          "x18y40",
        ]
      },
      {
        name: "Vancouver",
        squares: [
          "x8y37",
          "x8y38",
        ]
      }
    ];
    var opportunities = rallyLocations.map((location) => {
      return {
        name: `Organize a rally in ${location.name}?`,
        squares: location.squares,
        importance: 0.6,
      }
    });

    opportunities.push({
      name: "You've been invited to the National leader's debate. Do you want to accept the invitation?",
      importance: 0.8,
    });

    opportunities.push({
      name: "CBC wants to interview you. Do you want to accept the invitation?",
      importance: 0.2
    });

    opportunities.push({
      name: "Your volunteers are throwing community dinners in seat-rich Toronto suburbs. Go for it?",
      importance: 0.2
    });

    opportunities.push({
      name: "Your campaign advisor suggests running attack ads. Go for it?",
      importance: 0.6,
    });

    var pickedOpportunity = opportunities[Math.floor(Math.random()*opportunities.length)];
    return new Opportunity(pickedOpportunity.name, "Yes", callback, pickedOpportunity.importance, pickedOpportunity.squares);
  }

  filter(location) {
    return function(person) {
      if (this.squares && this.squares.constructor === Array) {
        if (_.includes(this.squares, location)) {
          var rnd = Math.random();
          return rnd > this.importance;
        } else {
          return false;
        }

      } else {
        // Nationwide event
        return true;
      }
    }.bind(this);
  }
}
