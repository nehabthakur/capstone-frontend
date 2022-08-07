import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";
import UserService from "../services/user.service";

type Props = {};

type State = {
    redirect: string | null, userReady: boolean,
    currentUser: IUser & { token: string },
    selectedStudentFile: File | null, isStudentFilePicked: boolean,
    selectedSupervisorFile: File | null, isSupervisorFilePicked: boolean,
    selectedSupervisorAssignmentFile: File | null, isSupervisorAssignmentFilePicked: boolean,
    selectedSecondaryExaminerFile: File | null, isSecondaryExaminerFilePicked: boolean,
    selectedFinalGradesFile: File | null, isFinalGradesFilePicked: boolean,
}

export default class Admin extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            redirect: null, userReady: false, currentUser: {token: ""},
            selectedStudentFile: null, isStudentFilePicked: false,
            selectedSupervisorFile: null, isSupervisorFilePicked: false,
            selectedSupervisorAssignmentFile: null, isSupervisorAssignmentFilePicked: false,
            selectedSecondaryExaminerFile: null, isSecondaryExaminerFilePicked: false,
            selectedFinalGradesFile: null, isFinalGradesFilePicked: false,
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) this.setState({redirect: "/login"});
        this.setState({currentUser: currentUser, userReady: true})
    }

    studentChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        this.setState({selectedStudentFile: file ? file : null, isStudentFilePicked: true});
    }

    handleStudentSubmission = () => {
        if (!this.state.selectedStudentFile) {
            alert("Please select a file before clicking submit");
            return;
        }

        const formData = new FormData();
        formData.append("file", this.state.selectedStudentFile);
        UserService.postStudentInfo(formData)
            .then(r => {
                    if (r.status === 200) {
                        alert("Successfully uploaded student info");
                    } else {
                        alert("Student info updation failed with status code " + r.status);
                    }
                }
            ).catch(_ => {
                    alert("Error uploading student info");
                }
            );
    };

    supervisorChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        this.setState({selectedSupervisorFile: file ? file : null, isSupervisorFilePicked: true});
    }

    handleSupervisorSubmission = () => {
        if (!this.state.selectedSupervisorFile) {
            alert("Please select a file before clicking submit");
            return;
        }

        const formData = new FormData();
        formData.append("file", this.state.selectedSupervisorFile);
        UserService.postSupervisorInfo(formData)
            .then(r => {
                    if (r.status === 200) {
                        alert("Successfully uploaded supervisor info");
                    } else {
                        alert("Error uploading supervisor info");
                    }
                }
            ).catch(_ => {
                    alert("Error uploading supervisor info");
                }
            );
    };

    supervisorAssignmentChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        this.setState({selectedSupervisorAssignmentFile: file ? file : null, isSupervisorAssignmentFilePicked: true});
    }

    handleSupervisorAssignmentSubmission = () => {
        if (!this.state.selectedSupervisorAssignmentFile) {
            alert("Please select a file before clicking submit");
            return;
        }

        const formData = new FormData();
        formData.append("file", this.state.selectedSupervisorAssignmentFile);
        UserService.postSupervisorAssignmentInfo(formData)
            .then(r => {
                    if (r.status === 200) {
                        alert("Successfully uploaded supervisor assignment info");
                    } else {
                        alert("Error uploading supervisor assignment info");
                    }
                }
            ).catch(_ => {
                    alert("Error uploading supervisor assignment info");
                }
            );
    }

    secondaryExaminerChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        this.setState({selectedSecondaryExaminerFile: file ? file : null, isSecondaryExaminerFilePicked: true});
    }

    handleSecondaryExaminerSubmission = () => {
        if (!this.state.selectedSecondaryExaminerFile) {
            alert("Please select a file before clicking submit");
            return;
        }

        const formData = new FormData();
        formData.append("file", this.state.selectedSecondaryExaminerFile);
        UserService.postSecondaryExaminerInfo(formData)
            .then(r => {
                    if (r.status === 200) {
                        alert("Successfully uploaded secondary examiner info");
                    } else {
                        alert("Error uploading secondary examiner info");
                    }
                }
            ).catch(_ => {
                    alert("Error uploading secondary examiner info");
                }
            );
    }

    finalGradesChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        this.setState({selectedFinalGradesFile: file ? file : null, isFinalGradesFilePicked: true});
    }

    handleFinalGradesSubmission = () => {
        if (!this.state.selectedFinalGradesFile) {
            alert("Please select a file before clicking submit");
            return;
        }

        const formData = new FormData();
        formData.append("file", this.state.selectedFinalGradesFile);
        UserService.postFinalGrades(formData)
            .then(r => {
                    if (r.status === 200) {
                        alert("Successfully uploaded final grades info");
                    } else {
                        alert("Error uploading final grades info");
                    }
                }
            ).catch(_ => {
                    alert("Error uploading final grades info");
                }
            );
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>
        }

        const {currentUser} = this.state;

        if (!currentUser.roles?.includes("project_coordinator")) {
            return <div>Unauthorized</div>
        }

        return (
            <div>
                <strong>Upload student info:</strong>
                <br/>
                <input type="file" name="file" onChange={this.studentChangeHandler} />
                <div>
                    <button onClick={this.handleStudentSubmission}>Submit</button>
                </div>
                <br/>
                <strong>Upload supervisor info:</strong>
                <br/>
                <input type="file" name="file" onChange={this.supervisorChangeHandler} />
                <div>
                    <button onClick={this.handleSupervisorSubmission}>Submit</button>
                </div>
                <br/>
                <strong>Assign Supervisors:</strong>
                <br/>
                <input type="file" name="file" onChange={this.supervisorAssignmentChangeHandler} />
                <div>
                    <button onClick={this.handleSupervisorAssignmentSubmission}>Submit</button>
                </div>
                <br/>
                <strong>Upload secondary examiner info:</strong>
                <br/>
                <input type="file" name="file" onChange={this.secondaryExaminerChangeHandler} />
                <div>
                    <button onClick={this.handleSecondaryExaminerSubmission}>Submit</button>
                </div>
                <br/>
                <strong>Upload final grades:</strong>
                <br/>
                <input type="file" name="file" onChange={this.finalGradesChangeHandler} />
                <div>
                    <button onClick={this.handleFinalGradesSubmission}>Submit</button>
                </div>
                <br/>
            </div>
        );
    }
}
