var $ = require("jquery");
var Alignment = require("./Alignment.js");

export default class Stance {
  constructor(party, text, index) {
    this.party = party;
    this.index = index;

    this.element = $(
      `
      <div class="stance">
        <h3></h3>
      </div>
      `
    );
    this.element.find("h3").text(text);
    this.element.append(
      new Alignment("Disagree", "Agree", this.party.views[this.index], this.setValue.bind(this)).element
    );
  }

  setValue(value) {
    console.log("HERE");
    if (value) this.party.views[this.index] = (value*2)-1;
  }
}
