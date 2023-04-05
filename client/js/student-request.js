function getModules(student, id, label) {
  // student does NOT exist, display warning message and cancel request
  if (student.studentModules === null) {
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
  const route = `student/SOC/tutorial/${id.slice(2)}/`;
  const response = await fetch(route);
  const res = await response.json();


  const student = await getModules(res, id, label);
}