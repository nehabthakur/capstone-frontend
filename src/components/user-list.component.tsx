import {Component} from "react";
import {Redirect} from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";
import ISupervisor from "../types/supervisor.type";
import React from "react";
import UserService from "../services/user.service";


type Props = {};

type State = {
    redirect: string | null, supervisorsReady: boolean, studentsReady: boolean,
    currentUser: IUser & { token: string }, supervisors: Array<ISupervisor>, students: Array<IUser>,
    showStudents: boolean
}

export default class UserList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            redirect: null,
            supervisorsReady: false,
            studentsReady: false,
            currentUser: {token: ""},
            supervisors: [],
            students: [],
            showStudents: true
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) {
            this.setState({redirect: "/login"});
        } else {
            UserService.getSupervisors()
                .then(r => {
                    this.setState({supervisors: r.data, supervisorsReady: true});
                });
            UserService.getStudents()
                .then(r => {
                    this.setState({students: r.data, studentsReady: true});
                });
        }

        this.setState({currentUser: currentUser})
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>
        }

        const {currentUser} = this.state;

        if (!currentUser.roles?.includes("project_coordinator")) {
            return <div>Unauthorized</div>
        }

        if (!this.state.supervisorsReady || !this.state.studentsReady) {
            return <div>Loading...</div>
        }

        const studentTable = (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Student ID</th>
                </tr>
                </thead>
                <tbody>
                {this.state.students.map((student, index) => {
                    return (
                        <tr key={index}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.id}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        )

        const supervisorTable = (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Areas of Interest</th>
                    <th>Slots Allocated</th>
                    <th>Slots Available</th>
                </tr>
                </thead>
                <tbody>
                {this.state.supervisors.map((supervisor, index) => {
                    return (
                        <tr key={index}>
                            <td>{supervisor.name}</td>
                            <td>{supervisor.email}</td>
                            <td>{supervisor.areas}</td>
                            <td>{supervisor.slots ? supervisor.slots : 0}</td>
                            <td>{(supervisor.slots ? supervisor.slots : 0) - (supervisor.students ? supervisor.students.length : 0)}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        )

        return (
            <div className="container">
                <div>
                    <input type="radio" name="students" value="students" onChange={_ => {
                        this.setState({showStudents: true})
                    }} defaultChecked={true}/> Students
                    <div className="space"/>
                    <input type="radio" name="students" value="supervisors" onChange={_ => {
                        this.setState({showStudents: false})
                    }}/> Supervisors
                </div>
                <br/>
                <div>
                    {this.state.showStudents ? studentTable : supervisorTable}
                </div>
            </div>
        )
    }
}
