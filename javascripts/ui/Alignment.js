let $ = require("jquery");

export default class Alignment {
  constructor(left, right, callback = function(){}) {
    this.element = $.parseHTML(
      `
      <div class="alignment">
        <div class="alignment_axis">
          <div class="alignment_l"></div>
          <div class="alignment_r"></div>
        </div>
        <div class="alignment_slider">
          <div class="alignment_selector ui-widget-content"></div>
        </div>
      </div>
      `
    );
    $(this.element).find(".alignment_l").text(left);
    $(this.element).find(".alignment_r").text(right);
    let selector = $(this.element).find(".alignment_selector");
  }
}
