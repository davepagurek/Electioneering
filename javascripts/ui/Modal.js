
global.jQuery = require("jquery");
var $ = global.jQuery;
require("bootstrap");

export default class Modal {
  constructor(title, content) {
    var elementHtml = `
      <div class="modal fade">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title">${title}</h4>
            </div>
            <div class="modal-body">
              <p>${content}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.element = $(elementHtml);
    this.element.find(".modal").on('hidden', function () {
        $(this).remove();
    });
  }
}
