import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5000/';

class UserService {
    getStudentOverview() {
        return axios.get(API_URL + 'student/overview', {headers: authHeader()});
    }

    postSupervisorShortlist(supervisor_1: string | null | undefined, supervisor_2: string | null | undefined, supervisor_3: string | null | undefined, supervisor_4: string | null | undefined, supervisor_5: string | null | undefined) {
        return axios.post(API_URL + 'student/shortlist', {
            supervisor_1, supervisor_2, supervisor_3, supervisor_4, supervisor_5
        }, {headers: authHeader()});
    }

    getSupervisorShortlist() {
        return axios.get(API_URL + 'student/shortlist', {headers: authHeader()});
    }

    getSupervisors() {
        return axios.get(API_URL + 'supervisor/all', {headers: authHeader()});
    }

    getSupervisorOverview() {
        return axios.get(API_URL + 'supervisor/overview' , {headers: authHeader()});
    }

    postStudentInfo(formData: FormData) {
        return axios.post(API_URL + 'student/info', formData, {headers: authHeader()});
    }

    postSupervisorInfo(formData: FormData) {
        return axios.post(API_URL + 'supervisor/info', formData, {headers: authHeader()});
    }

    postSecondaryExaminerInfo(formData: FormData) {
        return axios.post(API_URL + 'secondary_examiner/info', formData, {headers: authHeader()});
    }

    updateStudentProjectInfo(formValue: {title: string, description: string}) {
        return axios.post(API_URL + 'student/project_info', formValue, {headers: authHeader()});
    }

    updateSupervisorProjectInfo(formValue: {areas: string, info: string, projects: {title: string, description: string}[]}) {
        return axios.post(API_URL + 'supervisor/project_info', formValue, {headers: authHeader()});
    }

    getProjectCoordinatorBoard(email: string) {
        return axios.get(API_URL + 'project_coordinator/' + email, {headers: authHeader()});
    }
}

export default new UserService();
