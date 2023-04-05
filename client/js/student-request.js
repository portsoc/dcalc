function getModules(student, id, label) {
  // student does NOT exist, display warning message and cancel request
  if (student.studentModules === null || student.studentModules === undefined) {
    label.textContent = `Sorry the student ${id} does not exist`;
    return null;
  }
  label.textContent = `Module marks for ${id} have been loaded`;

  const LEVEL_5 = [];

  const sModules = student.studentModules.modules;
  // confirm all modules are from level 5
  const is_LVLFive = Object.values(sModules).every(module => module.level === 5);
  
  // confirm whether module grades are from level 5 or 6
  if (is_LVLFive) {
    for (const module in sModules) {;
      const modMarks = {
        name: sModules[module].name,
        marks: sModules[module].marks.agreedModuleMark
      };
      LEVEL_5.push(modMarks);
    }
        
    // autofill the modules to "second year" list
    for (let i = 0; i < LEVEL_5.length-1; i++) {
      const module = LEVEL_5[i];
      const modNameInput = document.querySelector(`#l5name${(i+1)}`);
      const moduleMarksInput = document.querySelector(`#l5mark${(i+1)}output`);
      modNameInput.value = module.name;
      moduleMarksInput.value = module.marks;
    }    
  }
  console.log(LEVEL_5);
}

export default async function getStudentData(id, label) {
  const route = `student/SOC/tutorial/${id.slice(2)}/`;
  const response = await fetch(route);
  const res = await response.json();


  const student = await getModules(res, id, label);
}