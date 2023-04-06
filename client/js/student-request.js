function getModules(student, id, label) {
  // student does NOT exist, display warning message and cancel request
  if (!student.studentModules) {
    label.textContent = `Sorry the student ${id} does not exist`;
    return null;
  }
  label.textContent = `Module marks for ${id} have been loaded`;

  const sModules = student.studentModules.modules;
  // confirm all modules are from level 5, skip level 4's
  const is_LVLFive =
  Object.values(sModules)
    .slice(0, 6)
    .some(module => module.level === 5)
    &&
  Object.values(sModules)
    .slice(0, 6)
    .every(module => module.level === 4 || module.level === 5);

  
  console.log(is_LVLFive);
  // confirm whether module grades are from level 5 or 6
  if (is_LVLFive) {
    const LEVEL_5 = [];
    
    Object.values(sModules).slice(0, 6).forEach((module, i) => {
      const modMarks = {
        name: module.name,
        marks: module.marks.agreedModuleMark
      };
      LEVEL_5.push(modMarks);
  
      const modNameInput = document.querySelector(`#l5name${i+1}`);
      const modSlider = document.querySelector(`#l5mark${i+1}`);
      const moduleMarksInput = document.querySelector(`#l5mark${i+1}output`);
      modNameInput.value = modMarks.name;
      // check if marks exist for a specific module (i.e. not null)
      if (modMarks.marks) {
        console.log(modMarks.marks);
        modSlider.value = modMarks.marks;
        moduleMarksInput.value = modMarks.marks;
      }
    });
    
    console.log(LEVEL_5);
  }
}

export default async function getStudentData(id, label) {
  const route = `student/SOC/tutorial/${id.slice(2)}/`;
  const response = await fetch(route);
  const { studentModules } = await response.json();
  console.log({studentModules});
  const student = await getModules({ studentModules }, id, label);
}