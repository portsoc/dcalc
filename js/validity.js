const messages = {
    "max100": "100 is the maximum grade.",
    "min0": "Zero (0) is the lowest grade."
};

function init() {
    const numbers = document.querySelectorAll('input[type="number"]');

    for (const num of numbers) {
        num.addEventListener('input', checkNumberValidity);
    }
}

function report(elem, msg) {
    const all = document.querySelectorAll('input');
    all.forEach(e => e.setCustomValidity(""));
    elem.setCustomValidity(msg);
    elem.reportValidity();
}

function checkNumberValidity(e) {
    if (e.target.validity.rangeOverflow) {
        e.target.value = Math.min(e.target.max, e.target.value);
        report(e.target, messages.max100);
        e.preventDefault();
        return false;
    }
    if (e.target.validity.rangeUnderflow) {
        e.target.value = Math.max(e.target.min, e.target.value);
        report(e.target, messages.min0);
        e.preventDefault();
        return false;
    }
    report(e.target, "");
}


window.addEventListener('load', init);
