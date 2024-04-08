import fetchAPI from "../api/fetch";

const authProvider = {
  isAuthenticated: false,
  user: null,

  async register(data) {
    const userData = await fetchAPI("api/register", {
      method: "post",
      body: data,
    });

    return userData ? userData : null;
  },

  async login(data) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Fake delay

    const response = await fetchAPI("api/login", {
      method: "post",
      body: data,
    });
    if (!response) return;
    // Update state
    this.isAuthenticated = true;
    this.user = response.user;

    return response.user;
  },

  async logout() {
    const logout = await fetchAPI("api/logout", {
      method: "post",
    });
    if (!logout) return;
    // Update state
    this.isAuthenticated = false;
    this.user = null;
    console.log(logout.message);
  },
};

export default authProvider;
