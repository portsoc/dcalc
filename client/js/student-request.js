function getModules(student, id, label) {
  // student does NOT exist, display warning message and cancel request
  if (student.studentModules === null) {
    console.log('Student data does not exist.');
    label.textContent = `Sorry the student ${id} does not exist`;
    return null;
  }

  const sModules = student.studentModules.modules;
  // eslint-disable-next-line no-restricted-syntax
  for (const module in sModules) {
    console.log(sModules[module]);
  }
}

export default async function getStudentData(id, label) {
  console.log(`Result: before`);
  const route = `student/SOC/tutorial/${id.slice(2)}/`;
  const response = await fetch(route);
  const res = await response.json();
  console.log(res);


  const student = await getModules(res, id, label);
}