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
  shareLinkEl.addEventListener('input', preventShareLinkChanges);

  if (query.share) {
    // we are using shared marks, disabling local storage usage and mark editing
    loadSharedMarks(query);
    document.querySelector('#showingShared').style='';
    document.querySelector('#share').style='display: none';
    document.querySelector('#showingShared a').href = window.location.origin + window.location.pathname;
  } else {
    loadSavedMarks();
    createShareLink(); // must be done after loading saved marks
    for (const input of allInputs) {
      input.addEventListener('input', save);
    }
  }

  recalculate();
}

function preventShareLinkChanges(e) {
  createShareLink();
  e.target.select();
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
  const input = e.target;
  localStorage[input.id] = input.value;
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
  if (!marks) {

    document.querySelector('#ruleA').textContent = 'n/a';
    document.querySelector('#ruleB').textContent = 'n/a';
    document.querySelector('#ruleC').textContent = 'n/a';
    document.querySelector('#finalClassification').textContent = 'not enough data';
    return;
  }

  prepareMarks(marks);

  const a = ruleA(marks);
  const b = ruleB(marks);
  const c = ruleC(marks);

  document.querySelector('#ruleA').textContent = a;
  document.querySelector('#ruleB').textContent = b;
  document.querySelector('#ruleC').textContent = c;

  const finalMark = Math.max(a,b,c);
  const finalClassification = toClassification(finalMark);

  document.querySelector('#finalClassification').textContent = finalClassification;

  document.querySelector('#gpa').textContent = gpa(marks);

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
  let q = {};
  for (let i=0; i<params.length; i++) {
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

window.addEventListener('load', init);
