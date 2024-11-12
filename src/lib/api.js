import { ERROR_STATUS } from "../common/constants.js";

class OrgRepository {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async handleFetch(url, options = {}) {
    try {
      const res = await fetch(`${this.baseUrl}${url}`, options);
      if (!res.ok) {
        const errorMsg = this.getErrorMessage(res);
        throw new Error(errorMsg);
      }

      return await res.json();
    } catch (e) {
      console.error(`Network error :`, e);
      throw e;
    }
  }
  getErrorMessage(res) {
    const { status, statusText } = res;
    return ERROR_STATUS[status] || `Failed to fetch data: ${statusText}`;
  }

  async fetchUserList() {
    return this.handleFetch("/userList");
  }

  async search(query) {
    return this.handleFetch(`/userList?q=${query}`);
  }

  async fetchDepartmentList() {
    return this.handleFetch("/departmentList");
  }

  async fetchDepartmentNode(parentCode) {
    return this.handleFetch(`/departmentList?parentCode=${parentCode}`);
  }
}

export const orgRepository = new OrgRepository("http://localhost:3001");
