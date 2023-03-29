'use strict';

import express from 'express';
import getStudent from './getStudent.mjs';

const app = express();
app.use(express.static('client'));

// a request for retrieving student's data
app.get('/student/:studentID', async (req, res) => {
  const student = await getStudent(req.params.studentID.slice(2));

  // check if the student's data actually exists
  if (student === null) {
    res.json(null);
  } else {
    res.json("Good request");
  }
});


app.listen(8800);