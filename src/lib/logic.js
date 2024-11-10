import { fetchUserList } from "./api.js";

export async function fetchUsersByDepartment(departmentCode) {
  const userList = await fetchUserList();
  return userList.filter((user) => user.departmentCode === departmentCode);
}
