let $ = require("jquery");
let Alignment = require("./Alignment.js");

export default class Stance {
  constructor(politician, text, index) {
    this.politician = politician;
    this.index = index;

    this.element = $.parseHTML(
      `
      <div class="stance">
        <h3></h3>
      </div>
      `
    );
    $(this.element).find("h3").text(text);
    $(this.element).append(
      new Alignment("Disagree", "Agree").element
    );
  }

  setValue(value) {
    if (value) this.politician.opinions[this.id] = value;
  }
}
