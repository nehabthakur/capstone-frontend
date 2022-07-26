import axios from "axios";
import UserService from "./user.service";

const API_URL = "http://localhost:5000/";

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

  register(email: string, password: string, name: string) {
    return axios.post(API_URL + "sign-up", {
      email,
      password,
      name
    });
  }

  getCurrentUser() {
    const userStr = sessionStorage.getItem("user");
    if (!userStr) return null;

    return JSON.parse(userStr);
  }
}

export default new AuthService();
