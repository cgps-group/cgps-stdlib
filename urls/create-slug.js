const slugify = require("slugify");

module.exports = function createSlug(id, title) {
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
