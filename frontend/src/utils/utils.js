export function isValidJson(json) {
  try {
    JSON.parse(json);
  } catch (e) {
    return false;
  }
  return true;
}
