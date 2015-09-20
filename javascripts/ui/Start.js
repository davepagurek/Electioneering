var $ = require("jquery");

export default class Start {
  constructor(callback = function(){}) {
    this.element = $(
      `
      <div class="start_container">
        <div class="start">
          <h1>Electioneering!</h1>
          <h4>You are a politician. Campaign your way to victory!</h4>

          <h3>Name</h3>
          <input type="text" id="name" value="Richard Stallman" />

          <h3>Party</h3>
          <div class="parties">
            <a class="party" id="liberal"></a>
            <a class="party" id="ndp"></a>
            <a class="party" id="conservative"></a>
          </div>
        </div>
      </div>
      `
    );
    var remove = () => {
      this.element.stop().animate({
        "opacity": "0",
      }, 700, () => this.element.remove());
    };
    var element = this.element;
    this.element.find(".party").click(function() {
      remove();
      callback($(this).attr("id"), element.find("#name").val());
    });
  }
}
