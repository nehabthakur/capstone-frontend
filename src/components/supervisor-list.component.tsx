import {Component} from "react";
import {Redirect} from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";
import UserService from "../services/user.service";
import ISupervisor from "../types/supervisor.type";
import React from "react";


type Props = {};

type State = {
    redirect: string | null, userReady: boolean, currentUser: IUser & { token: string },
    supervisors: Array<ISupervisor> | null,
}

export default class SupervisorsList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            redirect: null, userReady: false, currentUser: {token: ""}, supervisors: null
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) {
            this.setState({redirect: "/login"});
        } else {
            UserService.getSupervisors()
                .then(r => {
                    this.setState({supervisors: r.data});
                });
        }

        this.setState({currentUser: currentUser, userReady: true})
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>
        }

        const {currentUser} = this.state;

        // display unauthorized if user is not student
        if (!currentUser.roles?.includes("student")) {
            return <div>Unauthorized</div>
        }

        return (<div className="container">
            {(this.state.userReady && this.state.supervisors) ? <div>
                <p>
                    {this.state.supervisors.map((supervisor, idx) => {
                        return (
                            <div key={idx}>
                                <p>
                                    <strong>Name:</strong>{" "}
                                    {supervisor.name}
                                </p>
                                <p>
                                    <strong>Email:</strong>{" "}
                                    {supervisor.email}
                                </p>
                                <p>
                                    <strong>Areas of Interest:</strong>{" "}
                                    {supervisor.areas}
                                </p>
                                <p>
                                    <strong>Total slots:</strong>{" "}
                                    {supervisor.slots}
                                </p>
                                <p>
                                    <strong>Slots taken:</strong>{" "}
                                    {supervisor.students?.length}
                                </p>
                                <p>
                                    <strong>Projects:</strong>{" "}
                                    {supervisor.projects?.map((project, idx) => {
                                        return (
                                            <div key={idx}>
                                                <p>
                                                    <strong>Project title:</strong>{" "}
                                                    {project.title}
                                                </p>
                                                <p>
                                                    <strong>Project description:</strong>{" "}
                                                    {project.description}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </p>
                            </div>
                        )
                    })}
                </p>
            </div> : null}
        </div>);
    }
}
