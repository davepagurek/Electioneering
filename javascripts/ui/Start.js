var $ = require("jquery");

export default class Start {
  constructor(callback = function(){}) {
    this.element = $(
      `
      <div class="start_container">
        <div class="start">
          <div id="selection">
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
          <div id="instructions" style="display:none">
            <h2>How to Play</h2>
            <p><strong>Gather data</strong> by <strong>viewing poll opportunity results</strong> to get a general view and by <strong>clicking on specific ridings</strong> to see an individual person's opinions. Riding colours reflect population density.</p>
            <p>Adjust your party's <strong>stances</strong> on Canadian issues.</p>
            <p>Tell people about your policy changes by <strong>responding to opportunities</strong>.</p>
            <p><strong>Call an election</strong> when you think you can win!</p>
            <button id="startBtn">Start</button>
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
    var self = this;
    this.element.find(".party").click(function() {
      self.party = $(this).attr("id");
      element.find("#selection").css("display", "none");
      element.find("#instructions").css("display", "block");
    });
    this.element.find("#startBtn").click(function() {
      remove();
      callback(self.party, element.find("#name").val());
    });
  }
}
