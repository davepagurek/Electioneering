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
      new Alignment("Disagree", "Agree", this.party.views[this.index]).element
    );
  }

  setValue(value) {
    if (value) this.party.views[this.index] = value;
  }
}
