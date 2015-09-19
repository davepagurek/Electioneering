var $ = require("jquery");

export default class Opportunity {
  constructor(question, action, callback = function(){}) {
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
      callback();
      this.remove();
    });
    this.element.find("h3").text(question);
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
}
