function getModules(student) {
  // student does NOT exist, display warning message and cancel request
  if (student.studentModules === null) {
    console.log('Student data does not exist.');
    return null;
  }

  const sModules = student.studentModules.modules;
  // eslint-disable-next-line no-restricted-syntax
  for (const module in sModules) {
    console.log(sModules[module]);
  }
}

// assign the path and retrieve student's data from it
async function getRequest(route) {
  const host = 'https://t-esbprep-apigw.port.ac.uk';
  const basePath = '/gateway/BiDataWarehouseSitsCourseModuleAssessmentAPI';

  const url = `${host}${basePath}/${route}`;
  const options = { headers: await fetch('./config/headers.json') };
  const result = await fetch(url, options);
  const student = await result.json();
  return getModules(student);
}

export default async function getStudentData(id, label) {
  const response = await fetch('./config/data.json');
  const data = await response.json();

  const route = `student/SOC/tutorial/${id}/${data.years.sep22}`;
  const student = await getRequest(route);
  console.log(student);
}