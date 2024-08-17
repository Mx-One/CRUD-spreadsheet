
const data = {
    data: [],
    get: function() {return this.data},
    set: function(update) {this.data = update},
    load: function() {console.log(this.data)}
}

module.exports = data