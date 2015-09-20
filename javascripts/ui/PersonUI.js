
var $ = require("jquery");
var _ = require("lodash");
var randomPick = require("../util/random").randomPick;

export default class PersonUI {
  constructor(person){
    this.person = person;
    this.element = $(`
        <div class="tweet animated bounceIn">
          <div class="person-name">${this.getName()}</div>
          <div class="person-age">${person.age}</div>
          <div class="person-party">Leans ${this.getParty()}</div>
           <button class="close">
             <i class="fa fa-times"></i>
           </button>
        </div>
      `);
    this.setTimer();
  }

  setTimer() {
    this.timer = setTimeout(() => {
      this.remove();
    }, 10000);
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

  getParty(){
    var partyIndex = this.person.parties.indexOf(_.max(this.person.parties));
    return ["Liberal", "NDP", "Conservative"][partyIndex];
  }

  getName(){
    var firstNames = [
      "Bob",
      "John",
      "Sam",
      "Alice",
      "Nicholas",
      "Tony",
      "Bilal",
      "Dave",
      "Mark"
    ];

    var lastNames = [
      "Smith",
      "Tessier-Ashpoole",
      "Potter",
      "Johnson",
      "Xu",
      "Liu",
      "Pagurek van Mossel",
      "Ayylmao",
    ];

    return `${randomPick(firstNames)} ${randomPick(lastNames)}`;
  }
}
