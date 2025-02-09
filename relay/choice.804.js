const kol = require('kolmafia')
// Trick or treating

// Actually defined in place.town.js
const {town_decorator} = require('./place.town.js');

module.exports.main = () => {
    town_decorator();
}
