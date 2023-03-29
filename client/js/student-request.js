export default async function getStudentData(id, label) {
  const response = await fetch(`student/${id}`);
  if (response.ok) {
    const data = await response.json();
    if (data === null) {
      label.textContent = `Sorry, there is no data associated with ${id}`;
    } else {
      console.log(data);
    }
  } else {
    throw new Error(response.Error);
  }
}