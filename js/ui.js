function init() {
  const query = parseQueryParams();

  const degreeInputs = document.querySelectorAll('.degree');
  for (const input of degreeInputs) {
    input.addEventListener('change', changeDegree);
  }

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

  document.getElementById('copy').addEventListener('click', copyToClipboard);
}

function changeDegree(e) {
  const degree = e.target.id;
  toggleMeng(degree === "meng")
}

function toggleMeng(show) {
  const l7Section = document.getElementById('l7')
  const l6Year = document.getElementById('l6year')
  const ruleC = document.getElementById('ruleC')
  l7Section.className = (show) ? '' : 'hidden'
  l6Year.textContent = (show) ? 'Third Year' : 'Final Year'
  ruleC.parentElement.className = (show) ? 'hidden' : ''

  recalculate()
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
  if (!marks) {

    document.querySelector('#ruleA').textContent = 'n/a';
    document.querySelector('#ruleB').textContent = 'n/a';
    document.querySelector('#ruleC').textContent = 'n/a';
    document.querySelector('#finalClassification').textContent = 'not enough data';
    return;
  }

  prepareMarks(marks);

  const usingMeng = !document.getElementById('l7').className.includes('hidden')

  const a = (usingMeng) ? ruleAMeng(marks) : ruleA(marks);
  const b = (usingMeng) ? ruleBMeng(marks) : ruleB(marks);
  const c = (usingMeng) ? 0 : ruleC(marks); // There is no 'Rule C' for an Integrated Masters

  document.querySelector('#ruleA').textContent = a;
  document.querySelector('#ruleB').textContent = b;
  document.querySelector('#ruleC').textContent = c;

  const finalMark = Math.max(a,b,c);
  const finalClassification = (usingMeng) ? toClassificationMeng(finalMark) : toClassification(finalMark);

  document.querySelector('#finalClassification').textContent = finalClassification;

  document.querySelector('#gpa').textContent = (usingMeng) ? 'n/a' : gpa(marks);
}

function gatherMarksFromPage() {
  const retval = {
    l5: [],
    l6: [],
    l7: {
      credits30: [],
      credits15: []
    },
    fyp: null,
    gip: null,
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

  const l7Inputs = document.querySelectorAll('#l7:not(.hidden) input:not(#gip)[type="number"]');
  if (l7Inputs.length) {
    for (const input of l7Inputs) {
      if (input.value === '') {
        console.log('no data', input);
        return null;
      }
      if (input.className.includes('credits30')) {
        retval.l7.credits30.push(Number(input.value));
      }
      if (input.className.includes('credits15')) {
        retval.l7.credits15.push(Number(input.value));
      }
    }

    if ((retval.l7.credits15.length + retval.l7.credits30.length) !== 4) {
      console.error('we do not have enough l7 inputs!');
    }
  } else {
    retval.l7 = {
      credits15: [],
      credits30: [],
    }
  }  

  const gipInput = document.querySelector('#l7:not(.hidden) #gip');
  if (gipInput) {
    if (gipInput.value === '') {
      console.log('no data', fypInput);
      return null;
    }
    retval.gip = Number(gipInput.value);
  } else {
    retval.gip = null;
  }

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

function copyToClipboard () {
  const sl = document.querySelector("#shareLink");
  sl.select();
  document.execCommand('copy');
  sl.blur();
}

window.addEventListener('load', init);
