const slugify = require("slugify");

module.exports.toSlug = function toSlug(id, title) {
  let path = id;
  if (title) {
    const slug = slugify(
      title,
      {
        lower: true,
        strict: true,
      },
    );
    path += `-${slug}`;
  }
  return path;
};
