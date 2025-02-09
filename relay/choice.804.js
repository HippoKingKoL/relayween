const kol = require('kolmafia')
// Trick or treating

// Actually defined in place.town.js
const {trick_or_treat_decorator} = require('./place.town.js');

module.exports.main = function (pageTextEncoded) {
    trick_or_treat_decorator(pageTextEncoded);
}
