var $ = require("jquery");

export default class Tweet {
  constructor(text, riding) {
    this.riding = $(`#${riding}`);
    this.riding.addClass("selected");
    this.element = $(
      `
      <div class="tweet">
        <div class="tweet_photo"></div>
        <div class="tweet_text"></div>
        <button class="close">
          <i class="fa fa-times"></i>
        </button>
      </div>
      `
    );
    this.element.find(".tweet_text").text(text);
    this.timer = setTimeout(() => {
      this.remove();
    }, 5000);
    this.element.on("mouseover", () => {
      this.element.stop().css("opacity", 1);
      clearTimeout(this.timer);
    });
    this.element.find(".close").on("click", () => {
      this.element.off();
      this.remove();
    });
    window.addEventListener("resize", () => {
      this.position();
    });
    this.position();
  }

  position() {
    this.element
      .css("top", `${this.riding.position().top + 20}px`)
      .css("left", `${this.riding.position().left}px`);
  }

  remove() {
    this.element.stop().animate({
      opacity:0
    }, 400, () => {
      this.riding.removeClass("selected");
      this.element.remove();
    });
  }
}
