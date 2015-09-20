var $ = require("jquery");

export default class Tweet {
  constructor(text, riding) {
    this.riding = $(`#${riding}`);
    this.riding.addClass("selected");
    this.element = $(
      `
      <div class="tweet">
        <div class="tweet_photo">
          <i class="fa fa-twitter"></i>
        </div>
        <div class="tweet_text"></div>
        <button class="close">
          <i class="fa fa-times"></i>
        </button>
      </div>
      `
    );
    this.element.find(".tweet_text").text(text);
    this.element.on("mouseover", () => {
      this.element.stop().css("opacity", 1);
      clearTimeout(this.timer);
    });
    this.element.find(".close").on("click", () => {
      this.element.off();
      this.remove();
    });
    this.element.on("mouseleave", () => {
      this.setTimer();
    });
    this.setTimer();
  }

  setTimer() {
    this.timer = setTimeout(() => {
      this.remove();
    }, 5000);
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
