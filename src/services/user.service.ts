import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5000/';

class UserService {
    getStudentOverview() {
        return axios.get(API_URL + 'student/overview', {headers: authHeader()});
    }

    postSupervisorShortlist(supervisor_1: string | null, supervisor_2: string | null, supervisor_3: string | null, supervisor_4: string | null, supervisor_5: string | null) {
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

    getProposalForm(email: string) {
        return axios.get(API_URL + 'student/project_proposal/' + email, {headers: authHeader()});
    }

    postProjectProposal(formValue: {supervisor_email: string, title: string, aim: string, rationale: string}) {
        return axios.post(API_URL + 'student/project_proposal', formValue, {headers: authHeader()});
    }

    getSupervisorInfo(email: string) {
        return axios.get(API_URL + 'supervisor/info/' + email, {headers: authHeader()});
    }
}

export default new UserService();
