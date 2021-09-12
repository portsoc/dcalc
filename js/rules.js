/*

calculate final classification based on l5/l6 marks

rules:

a) the classification of the weighted mean of all relevant credits at Level 5 and all relevant credits at Level 6 in the ratio of 40:60 respectively after first discounting the marks in the worst 20 credits both at Level 5 and at Level 6;
b) the classification of the weighted mean of all relevant credits at Level 6 after first discounting the marks in the worst 20 credits at Level 6;
c) the minimum classification in which more than 50% of the combined relevant credits at Level 5 and Level 6 were attained after first discounting the marks in the worst 20 credits both at Level 5 and at Level 6

rules summary:
a) l5mean * 0.4 + l6mean * 0.6
b) l6mean
c) just past the middle

source: https://regulations.docstore.port.ac.uk/ExamRegs9BoardofExaminers.pdf

marks are an object like this:

{
  l5: [ 45, 56, 34, 75, 43, 89 ],
  l6: [ 65, 76, 87, 67 ],
  fyp: 73,
}

*/

const gpaZones =   [
  [ 75, 100, 4.25 ],
  [ 71, 74, 4.00 ],
  [ 67, 70, 3.75 ],
  [ 64, 66, 3.50 ],
  [ 61, 63, 3.25 ],
  [ 57, 60, 3.00 ],
  [ 54, 56, 2.75 ],
  [ 50, 53, 2.50 ],
  [ 48, 48, 2.25 ],
  [ 43, 47, 2.00 ],
  [ 40, 42, 1.50 ],
  [ 38, 38, 1.00 ],
  [ 35, 37, 0.75 ],
  [ 30, 34, 0.50 ],
  [ 0, 28, 0.00 ]
];

function prepareMarks(marks) {
  marks.prepared = {};

  marks.prepared.l5 = marks.l5.slice();
  marks.prepared.l5.sort(reverseNumericalComparison);
  marks.prepared.l5.length = 5;

  marks.prepared.l6 = marks.l6.slice();
  marks.prepared.l6.sort(reverseNumericalComparison);
  marks.prepared.l6.length = 3;

  marks.prepared.l6.push(marks.fyp);
  marks.prepared.l6.push(marks.fyp);
  marks.prepared.l6.sort(reverseNumericalComparison);

  // add GPA
  marks.prepared.l5gpa = marks.prepared.l5.map(gradeToGPA);
  marks.prepared.l6gpa = marks.prepared.l6.map(gradeToGPA);
}

function reverseNumericalComparison(a, b) {
  return b-a;
}

function gradeToGPA(num) {
  num = Math.round(num); // round up from .5
  num = (num % 10 == 9 ? num+1 : num); // round nines up
  for (const zone of gpaZones) {
    if (num >= zone[0] && num <= zone[1]) return zone[2];
  }
  return -999;
}

function gpa(marks) {
  const weightedl5mean = mean(marks.prepared.l5gpa) * 0.4;
  const weightedl6mean = mean(marks.prepared.l6gpa) * 0.6;
  return Number( weightedl5mean + weightedl6mean ).toFixed(2);
}

function ruleA(marks) {
  const l5mean = mean(marks.prepared.l5);
  const l6mean = mean(marks.prepared.l6);
  return Math.round(l5mean * 0.4 + l6mean * 0.6);
}

function ruleB(marks) {
  const l6mean = mean(marks.prepared.l6);
  return Math.round(l6mean);
}

function ruleC(marks) {
  const allMarks = marks.prepared.l5.concat(marks.prepared.l6);
  allMarks.sort(reverseNumericalComparison);
  return Math.round(allMarks[allMarks.length / 2]);
}

function mean(array) {
  return array.reduce( (a,b) => a+b ) / array.length;
}

function toClassification(mark) {
  if (mark < 40) return 'Failed';
  if (mark < 50) return 'Third-class honours';
  if (mark < 60) return 'Second-class honours (lower division)';
  if (mark < 70) return 'Second-class honours (upper division)';
  return 'First-class honours';
}

window.rules = {
  prepareMarks: prepareMarks,
  gradeToGPA: gradeToGPA,
  gpa: gpa,
  ruleA: ruleA,
  ruleB: ruleB,
  ruleC: ruleC,
  mean: mean,
  toClassification: toClassification,
}

/* for testing

const marks = {
    l5: [45, 56, 67, 78, 89, 90],
    l6: [56, 67, 78, 89],
    fyp: 68,
}
*/
