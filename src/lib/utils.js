export function getDepartmentName(path) {
  const paths = path.split(";");
  const lastPaths = paths.slice(-2);
  return lastPaths.join(" > ");
}
