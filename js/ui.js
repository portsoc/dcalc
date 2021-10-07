import * as rules from './rules.js';
import * as validity from './validity.js';

function init() {
  const query = parseQueryParams();

  const inputs = document.querySelectorAll('input[type="number"]');
  for (const input of inputs) {
    input.addEventListener('input', recalculate);
  }

  const allInputs = document.querySelectorAll('.module input');
  for (const input of allInputs) {
    input.addEventListener('input', createShareLink);
  }

  const shareLinkEl = document.querySelector('#shareLink');
  shareLinkEl.addEventListener('click', (e) => e.target.select());

  if (query.share) {
    // we are using shared marks, disabling local storage usage and mark editing
    loadSharedMarks(query);
    document.querySelector('#showingShared').style = '';
    document.querySelector('#share').style = 'display: none';
    document.querySelector('#showingShared a').href = window.location.origin + window.location.pathname;
  } else {
    loadSavedMarks();
    createShareLink(); // must be done after loading saved marks
    for (const input of allInputs) {
      input.addEventListener('input', save);
    }
  }

  recalculate();

  document.getElementById('copy').addEventListener('click', copyToClipboard);

  setupHighlighting();

  validity.init();
  loadModules();
}

async function loadModules() {
  try {
    const response = await fetch('modules.txt');
    const modules = (await response.text()).split('\n');
    const elems = modules.map(module => {
      const e = document.createElement('option');
      e.value = module;
      return e;
    });
    document.querySelector('#module-list').append(...elems);
  } catch (e) {
    console.error('Failed to load list of modules, using defaults', e);
  }
}

function createShareLink() {
  let link = window.location.origin + window.location.pathname + '?share';
  const allInputs = document.querySelectorAll('.module input');
  for (const input of allInputs) {
    if (input.value) {
      link += `&${encodeURIComponent(input.id)}=${encodeURIComponent(input.value)}`;
    }
  }

  document.querySelector('#shareLink').value = link;
}

function loadSharedMarks(query) {
  const allInputs = document.querySelectorAll('.module input');
  for (const input of allInputs) {
    input.disabled = true;
    if (input.id in query) {
      input.value = query[input.id][0];
    }
  }
}

function save(e) {
  if (e.target.validity.valid) {
    const input = e.target;
    localStorage[input.id] = input.value;
  }
}

function loadSavedMarks() {
  const allInputs = document.querySelectorAll('input');
  for (const input of allInputs) {
    if (input.id in localStorage) {
      input.value = localStorage[input.id];
    }
  }
}

function recalculate() {
  const marks = gatherMarksFromPage();
  document.querySelector('#ruleAExp')?.remove();
  document.querySelector('#ruleBExp')?.remove();
  document.querySelector('#ruleCExp')?.remove();

  if (!marks) {
    document.querySelector('#ruleA').textContent = 'n/a';
    document.querySelector('#ruleB').textContent = 'n/a';
    document.querySelector('#ruleC').textContent = 'n/a';
    document.querySelector('#finalClassification').textContent = 'not enough data';
    document.querySelector('#gpa').textContent = 'n/a';
    return;
  }

  if (isAnyMarkUnder40(marks)) {
    document.querySelector('#ruleA').textContent = 'n/a';
    document.querySelector('#ruleB').textContent = 'n/a';
    document.querySelector('#ruleC').textContent = 'n/a';
    document.querySelector('#finalClassification').textContent = 'failed a module, no degree classification';
    document.querySelector('#gpa').textContent = 'n/a';
    return;
  }

  rules.prepareMarks(marks);

  const a = rules.ruleA(marks);
  const b = rules.ruleB(marks);
  const c = rules.ruleC(marks);

  document.querySelector('#ruleA').textContent = a;
  document.querySelector('#ruleB').textContent = b;
  document.querySelector('#ruleC').textContent = c;

  const finalMark = Math.max(a, b, c);
  const finalClassification = rules.toClassification(finalMark);

  document.querySelector('#finalClassification').textContent = finalClassification;

  document.querySelector('#gpa').textContent = rules.gpa(marks);

  const rulesTable = document.querySelector('#rule-explanation > dl');

  // populate rule A template
  const ruleACalcTemplate = document.querySelector('#ruleACalcExplained').content.cloneNode(true);
  ruleACalcTemplate.querySelector('.l5-lowest-grade').textContent = marks.prepared.l5Lowest;
  ruleACalcTemplate.querySelector('.l6-lowest-grade').textContent = marks.prepared.l6Lowest;
  ruleACalcTemplate.querySelector('.l5-calc').textContent = marks.prepared.l5Calc;
  ruleACalcTemplate.querySelector('.l6-calc').textContent = marks.prepared.l6Calc;
  ruleACalcTemplate.querySelector('.l5-mean').textContent = rules.mean(marks.prepared.l5);
  ruleACalcTemplate.querySelector('.l6-mean').textContent = rules.mean(marks.prepared.l6);
  ruleACalcTemplate.querySelector('.rule-a').textContent = a;

  // populate rule B template
  const ruleBCalcTemplate = document.querySelector('#ruleBCalcExplained').content.cloneNode(true);
  ruleBCalcTemplate.querySelector('.l6-lowest-grade').textContent = marks.prepared.l6Lowest;
  ruleBCalcTemplate.querySelector('.l6-calc').textContent = marks.prepared.l6Calc;

  // populate rule C template
  const ruleCCalcTemplate = document.querySelector('#ruleCCalcExplained').content.cloneNode(true);
  const allMarks = marks.prepared.l5.concat(marks.prepared.l6);
  allMarks.sort(rules.reverseNumericalComparison);
  const ruleCCalc = allMarks.join(', ');
  ruleCCalcTemplate.querySelector('#ruleCCalc').textContent = ruleCCalc;
  ruleCCalcTemplate.querySelector('#ruleCCalcResult').textContent = c;

  // append templates
  const ruleBTitle = document.querySelector('dt.rule-b-defn');
  rulesTable.insertBefore(ruleACalcTemplate, ruleBTitle);

  const ruleCTitle = document.querySelector('dt.rule-c-defn');
  rulesTable.insertBefore(ruleBCalcTemplate, ruleCTitle);

  rulesTable.appendChild(ruleCCalcTemplate);
}

function isAnyMarkUnder40(marks) {
  return marks.fyp < 40 ||
    marks.l5.some(m => m < 40) ||
    marks.l6.some(m => m < 40);
}

function gatherMarksFromPage() {
  const retval = {
    l5: [],
    l6: [],
    fyp: null,
  };

  const l5Inputs = document.querySelectorAll('#l5 input[type="number"]');
  for (const input of l5Inputs) {
    if (input.value === '') {
      console.log('no data', input);
      return null;
    }
    retval.l5.push(Number(input.value));
  }

  if (retval.l5.length !== 6) {
    console.error('we do not have enough l5 inputs!');
  }

  const l6Inputs = document.querySelectorAll('#l6 input:not(#fyp)[type="number"]');
  for (const input of l6Inputs) {
    if (input.value === '') {
      console.log('no data', input);
      return null;
    }
    retval.l6.push(Number(input.value));
  }

  if (retval.l6.length !== 4) {
    console.error('we do not have enough l6 inputs!');
  }

  const fypInput = document.querySelector('#fyp');
  if (fypInput.value === '') {
    console.log('no data', fypInput);
    return null;
  }
  retval.fyp = Number(fypInput.value);

  return retval;
}

// query parsing functions, adapted from stackoverflow
function parseQueryParams() {
  const search = location.search.substring(1).replace(/\+/g, ' ');

  /* parse the query */
  const params = search.replace(/;/g, '&').split('&');
  const q = {};
  for (let i = 0; i < params.length; i++) {
    const t = params[i].split('=', 2);
    const name = decodeURIComponent(t[0]);
    if (!q[name]) {
      q[name] = [];
    }
    if (t.length > 1) {
      q[name].push(decodeURIComponent(t[1]));
    } else {
      q[name].push(true);
    }
  }
  return q;
}

function copyToClipboard() {
  const sl = document.querySelector('#shareLink');
  sl.select();
  document.execCommand('copy');
  sl.blur();
}

function setupHighlighting() {
  const triggers = document.querySelectorAll('[data-highlight]');
  for (const trigger of triggers) {
    trigger.addEventListener('mouseenter', () => highlight(trigger, true));
    trigger.addEventListener('mouseleave', () => highlight(trigger, false));
  }
}

function highlight(trigger, showHighlight) {
  const targets = document.querySelectorAll(trigger.dataset.highlight);
  for (const target of targets) {
    target.classList.toggle('highlight', showHighlight);
  }
}

window.addEventListener('load', init);
