export async function fetchUserList() {
  try {
    const res = await fetch("http://localhost:3001/userList");
    return await res.json();
  } catch (e) {
    console.error("Failed to fetch data:", e);
    throw e;
  }
}

export async function search(query) {
  try {
    const res = await fetch(`http://localhost:3001/userList?q=${query}`);
    return await res.json();
  } catch (e) {
    console.error("Failed to fetch data:", e);
    throw e;
  }
}

export async function fetchDepartmentList() {
  try {
    const res = await fetch("http://localhost:3001/departmentList");
    return await res.json();
  } catch (e) {
    console.error("Failed to fetch data:", e);
    throw e;
  }
}

export async function fetchDepartmentNode(parentCode) {
  try {
    const res = await fetch(
      `http://localhost:3001/departmentList?parentCode=${parentCode}`
    );
    if (!res.ok) throw new Error("Network Error: fetch error");

    return await res.json();
  } catch (e) {
    console.error("Failed to fetch data:", e);
    throw e;
  }
}
