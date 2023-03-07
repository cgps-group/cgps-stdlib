export default function generateUniqueName(allNames, name) {
  let uniqueName = name;
  let postfix = 1;

  while (allNames.has(uniqueName)) {
    uniqueName = `${name}-${postfix}`;
    postfix += 1;
  }

  return uniqueName;
}
