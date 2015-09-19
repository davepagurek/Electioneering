var $ = require("jquery");

export default class Alignment {
  constructor(left, right, callback = function(){}) {
    this.element = $(
      `
      <div class="alignment">
        <div class="alignment_axis">
          <div class="alignment_l"></div>
          <div class="alignment_r"></div>
        </div>
        <div class="alignment_slider">
          <div class="alignment_selector"></div>
        </div>
      </div>
      `
    );
    this.element.find(".alignment_l").text(left);
    this.element.find(".alignment_r").text(right);

    this.selector = $(this.element).find(".alignment_selector");
    var mouseMove = (event) => {
      event.preventDefault();
      var width = this.selector.parent().width();
      var x = event.pageX - this.selector.parent().offset().left;
      if (x < 0) x = 0;
      if (x > width) x = width;
      this.selector.css("left", `${x}px`);
      callback(this.selector.position().left/width);
      return false;
    };
    window.addEventListener("mouseup", () => window.removeEventListener('mousemove', mouseMove, true))
    this.selector.on("mousedown", () => window.addEventListener('mousemove', mouseMove, true))
  }
}
