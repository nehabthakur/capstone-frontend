import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5000/';

class UserService {
  getStudentBoard(email: string) {
    return axios.get(API_URL + 'student/' + email, { headers: authHeader() });
  }

  getSupervisorBoard(email: string) {
    return axios.get(API_URL + 'supervisor/' + email, { headers: authHeader() });
  }

  getProjectCoordinatorBoard(email: string) {
    return axios.get(API_URL + 'project_coordinator/' + email, { headers: authHeader() });
  }
}

export default new UserService();
