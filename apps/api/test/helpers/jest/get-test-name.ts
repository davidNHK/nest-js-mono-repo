export function getTestName() {
  return expect.getState().currentTestName.toLowerCase().split(' ').join('-');
}
