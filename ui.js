function init() {
  const inputs = document.querySelectorAll('input[type="number"]');
  for (const input of inputs) {
    input.addEventListener('input', recalculate);
  }
}

function recalculate() {
  const marks = gatherMarksFromPage();
  prepareMarks(marks);
  // todo call the rules
  // stick their results in the page
}

window.addEventListener('load', init);
