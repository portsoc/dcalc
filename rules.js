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

marks are an object like this:

{
  l5: [ 45, 56, 34, 75, 43, 89 ],
  l6: [ 65, 76, 87, 67 ],
  fyp: 73,
}

*/

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
}

function reverseNumericalComparison(a, b) {
  return b-a;
}


function ruleA(marks) {
  const l5mean = mean(marks.prepared.l5);
  const l6mean = mean(marks.prepared.l6);
  return l5mean * 0.4 + l6mean * 0.6;
}

function ruleB(marks) {
  return mean(marks.prepared.l6);
}

function ruleC(marks) {
  const allMarks = marks.prepared.l5.concat(marks.prepared.l6);
  allMarks.sort(reverseNumericalComparison);
  return allMarks[allMarks.length / 2 + 1];
}

function mean(array) {
  let sum = 0;
  for (const num of array) {
    sum += num;
  }
  const mean = sum/array.length;
  return mean;
}

function toClassification(mark) {
  if (mark < 40) return 'Failed';
  if (mark < 50) return 'Third-class honours';
  if (mark < 60) return 'Second-class honours (lower division)';
  if (mark < 70) return 'Second-class honours (upper division)';
  return 'First-class honours';
}



/* for testing

const marks = {
    l5: [45, 56, 67, 78, 89, 90],
    l6: [56, 67, 78, 89],
    fyp: 68,
}
*/
