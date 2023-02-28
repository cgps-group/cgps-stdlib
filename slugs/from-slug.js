const slugify = require("slugify");

module.exports.fromSlug = function fromSlug(idOrSlug) {
  if ((/^[0-9A-Z]{22}-/i).test(idOrSlug)) {
    return idOrSlug.substr(0, 22);
  }
  else {
    return idOrSlug;
  }
};
