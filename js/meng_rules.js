/*

calculate final classification based on l5/l6/l7 marks

rules:

a) the classification of the weighted mean from all relevant credits at Level 6 and Level 7 in the ratio of 50:50 respectively, after first discounting the marks in the worst 20 credits at Level 6 and Level 7;
b) the classification of the weighted mean from all relevant credits at Levels 5, 6 and 7 in the ratio of 20:40:40 respectively, after first discounting the marks in the worst 20 credits at Level 5, Level 6 and Level 7.


rules summary:
a) (l6mean + l7mean) / 2
b) l5mean * 0.2 + l6mean * 0.4 + l7mean * 0.4

marks are an object like this:

{
  l5: [ 45, 56, 34, 75, 43, 89 ],
  l6: [ 65, 76, 87, 67 ],
  l7: {
    credits15: [ 57, 83 ],
    credits30: [ 67, 59 ],
  }
  fyp: 73,
  gip: 80,
}

*/
  
// No need to overwrite prepareMarks function. There is no preparation for l7, since the different credit weighting means the mean needs to be worked out differently anyway

function l7Mean(marks) {
  // Becuase the l7 modules are not a multiple of 20 credits, some more work is needed to calculate the mean.
  const marks30Credits = marks.l7.credits30.slice();
  marks30Credits.push(marks.gip); // Group Industrial Project (gip) is a 30 credit module.
  const marks15Credits = marks.l7.credits15.slice();

  marks30Credits.sort(reverseNumericalComparison);
  marks15Credits.sort(reverseNumericalComparison);
  
  const lowest30CreditModule = marks30Credits.pop();
  const lowest15CreditModule = marks15Credits.pop();

  let weighted30Credits = [];
  let weighted15Credits = [];

  if (lowest30CreditModule <= lowest15CreditModule) {
    // Weight all the marks besides the lowest
    weighted30Credits = marks30Credits.map(m => m * 30);
    weighted15Credits = marks15Credits.map(m => m * 15);

    weighted30Credits.push(lowest30CreditModule * 10); // Lowest scoring module was a 30 credit module, so remove 20 credits, and add to weighted array.

    weighted15Credits.push(lowest15CreditModule * 15); // Lowest 20 credits have now been accounted for, so add lowest 15 credit module with normal weighting.
  } else {
    // Lowest scoring module was a 15 credit module. Removing this module leaves 5 credits unaccounted for, so we need to look for the next lowest module mark.
    const secondLowest15CreditModule = marks15Credits.pop();
    // No need to look for second lowest 30 credit module, since the lowest 30 credit module has NOT been discredited (yet).

    // First, weight all the marks, except for the lowest and second lowest 15 credit module, and the lowest 30 credit module
    weighted30Credits = marks30Credits.map(m => m * 30);
    weighted15Credits = marks15Credits.map(m => m * 15);

    if (lowest30CreditModule < secondLowest15CreditModule) {
      weighted30Credits.push(lowest30CreditModule * 25); // The second lowest module mark was worth 30 credits, so it is now worth 25.
      weighted15Credits.push(secondLowest15CreditModule * 15); // The second lowest 15 credit module was not the second lowest overall, so add it with normal weighting.
    } else {
      weighted15Credits.push(secondLowest15CreditModule * 10); // The second lowest 15 credit module was the second lowest overall, so it is now worth 10 credits.
      weighted30Credits.push(lowest30CreditModule * 30); // The lowest 30 credit module was not the second lowest overall, so add it with normal weighting.
    }
  }

  const allWeightedMarks = weighted15Credits.concat(weighted30Credits);
  return sum(allWeightedMarks) / 100; // Sum of all credits is now 100, so divide by 100 for the mean
}

function sum(array) {
  return array.reduce((a, b) => a + b, 0);
}

function ruleAMeng(marks) {
  const l6mean = mean(marks.prepared.l6);
  const l7mean = l7Mean(marks);
  return roundDown(l6mean * 0.5 + l7mean * 0.5);
}

function ruleBMeng(marks) {
  const l5mean = mean(marks.prepared.l5);
  const l6mean = mean(marks.prepared.l6);
  const l7mean = l7Mean(marks);
  return roundDown(l5mean * 0.2 + l6mean * 0.4 + l7mean * 0.4);
}

function toClassificationMeng(mark) {
  if (mark < 40) return 'Failed';
  if (mark < 60) return 'Pass';
  if (mark < 70) return 'with Merit';
  return 'with Distinction';
}



/* for testing

const marks = {
    l5: [45, 56, 67, 78, 89, 90],
    l6: [56, 67, 78, 89],
    fyp: 68,
}
*/
