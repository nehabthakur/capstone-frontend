import axios from "axios";

const API_URL = "http://127.0.0.1:5000/";

class AuthService {
  login(email: string, password: string) {
    return axios
      .post(API_URL + "sign-in", {
        email,
        password
      })
      .then(response => {
        if (response.data.token) {
          sessionStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    sessionStorage.removeItem("user");
  }

  getCurrentUser() {
    const userStr = sessionStorage.getItem("user");
    if (!userStr) return null;

    return JSON.parse(userStr);
  }
}

export default new AuthService();
