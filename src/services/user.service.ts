import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5000/';

class UserService {
  getStudentBoard() {
    return axios.get(API_URL + 'student', { headers: authHeader() });
  }

  getSupervisorBoard() {
    return axios.get(API_URL + 'supervisor', { headers: authHeader() });
  }

  getProjectCoordinatorBoard() {
    return axios.get(API_URL + 'project_coordinator', { headers: authHeader() });
  }
}

export default new UserService();
