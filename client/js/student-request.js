function getModules(student, id, label) {
  // student does NOT exist, display warning message and cancel request
  if (student.studentModules === null) {
    label.textContent = `Sorry the student ${id} does not exist`;
    return null;
  }

  const LEVEL_5 = [];

  const sModules = student.studentModules.modules;
  // confirm all modules are from level 5
  const is_LVLFive = Object.values(sModules).every(module => module.level === 5);
  
  // autofill the modules to "second year" list
  if (is_LVLFive) {
    for (const module in sModules) {
      const modMarks = {
        name: sModules[module].name,
        level: sModules[module].level,
        marks: sModules[module].marks
      };
      LEVEL_5.push(modMarks);
    }
  }
}

export default async function getStudentData(id, label) {
  const route = `student/SOC/tutorial/${id.slice(2)}/`;
  const response = await fetch(route);
  const res = await response.json();


  const student = await getModules(res, id, label);
}