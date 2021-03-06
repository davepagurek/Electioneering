
module.exports = {
  randomIf: function(qualifier, callback, elseCallback){
    var rnd = Math.random();
    if (rnd > qualifier) {
      callback();
    } else if (elseCallback) {
      elseCallback();
    }
  },

  randomPick: function(array){
    return array[Math.floor(array.length*Math.random())];
  }
};
