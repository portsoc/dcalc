import fetch from 'node-fetch';
import { promises as fs, read, readFile } from 'fs';

const load = async (file) => JSON.parse( await fs.readFile(file, "utf8") );

const data = await load('./config/data.json');
const options = { headers: await load('./config/headers.json') };

async function getModules(student) {

  // student does NOT exist, display warning message and cancel request
  if (student.studentModules === null) {
    console.log('Student data does not exist.');
    return null;
  }

  const sModules = student.studentModules.modules;
  for (const module in sModules) {
    console.log(sModules[module]);
  }
}

// assign the path and retrieve student's data from it
async function getRequest(route) {
  const host = 'https://t-esbprep-apigw.port.ac.uk';
  const basePath = '/gateway/BiDataWarehouseSitsCourseModuleAssessmentAPI';

  const url = `${host}${basePath}/${route}`;
  const result = await fetch(url, options);
  const student = await result.json();

  return getModules(student);
}

export default function getStudent(id) {
  const route = `student/SOC/tutorial/${id}/${data.years.sep22}`;

  return getRequest(route);
}