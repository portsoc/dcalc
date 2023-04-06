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
  console.log(sModules);
  const is_LVLFive = Object.values(sModules).every(module => module.level === 5);
  
  // confirm whether module grades are from level 5 or 6
  if (is_LVLFive) {
    const LEVEL_5 = [];
    
    Object.values(sModules).forEach((module, i) => {
      const modMarks = {
        name: module.name,
        marks: module.marks.agreedModuleMark
      };
      LEVEL_5.push(modMarks);
  
      const modNameInput = document.querySelector(`#l5name${i+1}`);
      const modSlider = document.querySelector(`#l5mark${i+1}`);
      const moduleMarksInput = document.querySelector(`#l5mark${i+1}output`);
      modNameInput.value = modMarks.name;
      modSlider.value = modMarks.marks;
      moduleMarksInput.value = modMarks.marks;
    });
    
    console.log(LEVEL_5);
  }
}

export default async function getStudentData(id, label) {
  const route = `student/SOC/tutorial/${id.slice(2)}/`;
  const response = await fetch(route);
  const res = await response.json();


  const student = await getModules(res, id, label);
}