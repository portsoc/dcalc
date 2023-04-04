import * as rules from './rules.js';
import * as validity from './validity.js';
import getStudentData from './student-request.js';

function init() {
  const query = parseQueryParams();

  const inputField = document.getElementById("up-input");
  const displayText = document.getElementById("display-text");
  inputField.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      if (!inputField.value.toUpperCase().startsWith("UP")) {
        displayText.textContent = "Input must start with 'UP'!";
        return;
      }
      displayText.textContent = "Loading course data for: " + inputField.value.toUpperCase();
      getStudentData(inputField.value, displayText);
    }
  });

  const inputs = document.querySelectorAll('input[type="range"]');
  for (const input of inputs) {
    input.addEventListener('input', recalculate);
  }

  const rangeSliders = document.querySelectorAll('input[type="range"]');
  const numberInputs = document.querySelectorAll('input[type="number"]');
  const lockButtons = document.querySelectorAll('.lock-button');
  
  for (let i = 0; i < rangeSliders.length; i++) {
    rangeSliders[i].addEventListener('input', () => {
      if (!lockButtons[i].classList.contains('disabled')) {
        numberInputs[i].value = rangeSliders[i].value;
      }
      rangeSliders[i].value = numberInputs[i].value;
    });
    
    numberInputs[i].addEventListener('input', () => {
      rangeSliders[i].value = numberInputs[i].value;
    });
    
    lockButtons[i].addEventListener('click', () => {
      lockButtons[i].classList.toggle('disabled');
      rangeSliders[i].disabled = !rangeSliders[i].disabled;
      numberInputs[i].disabled = !numberInputs[i].disabled;
    });
  }

  /// END of button and slider section


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

  toggleTheme();
}

async function toggleTheme() {
  const toggler = document.querySelector('#theme-switch'),
        root = document.documentElement,
        currentTheme = localStorage.getItem('theme') || 'dark';

  if (currentTheme === 'light') {
    toggler.removeAttribute('checked');
  } else {
    toggler.checked = true;
  }

  root.setAttribute('data-theme', currentTheme);

  toggler.addEventListener('change', handleToggle, false);

  function handleToggle(e) {
    if (this.checked) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      console.log('Theme has been changed to: dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      console.log('Theme has been changed to: light');
    }

    console.log(`Current theme is: ${localStorage.getItem('theme')}`);
  }
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

// altering the range sliders inputt

async function recalculate() {
  const marks = await gatherMarksFromPage();

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
}

function isAnyMarkUnder40(marks) {
  return marks.fyp < 40 ||
    marks.l5.some(m => m < 40) ||
    marks.l6.some(m => m < 40);
}

async function gatherMarksFromPage() {
  const retval = {
    l5: [],
    l6: [],
    fyp: null,
  };

  const l5Inputs = document.querySelectorAll('#l5 input[type="range"]');
  for (const input of l5Inputs) {
    retval.l5.push(Number(input.value));
  }

  if (retval.l5.length !== 6) {
    console.error('we do not have enough l5 inputs!');
  }

  const l6Inputs = document.querySelectorAll('#l6 input:not(#fyp)[type="range"]');
  for (const input of l6Inputs) {
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


/// end of range sliders inputting altering

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
