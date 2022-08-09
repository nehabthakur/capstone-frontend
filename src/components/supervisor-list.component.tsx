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
    supervisors: Array<ISupervisor> | null, expandedRows: Array<number>
}

export default class SupervisorsList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            redirect: null, userReady: false, currentUser: {token: ""}, supervisors: null, expandedRows: []
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



    handleRowClick = (id: number) => {
        const currentExpandedRows = this.state.expandedRows;
        const isRowCurrentlyExpanded = currentExpandedRows.includes(id);

        const newExpandedRows = isRowCurrentlyExpanded ? currentExpandedRows.filter(row => row !== id) : currentExpandedRows.concat(id);

        this.setState({expandedRows: newExpandedRows});
    }

    renderItem = (supervisor: ISupervisor, index: number) => {
        const clickCallback = () => this.handleRowClick(index);
        const itemRows = [
            <tr key={index} onClick={clickCallback}>
                <td>{supervisor.name}</td>
                <td>{supervisor.areas}</td>
                <td>{(supervisor.slots ? supervisor.slots : 0) - (supervisor.students ? supervisor.students.length : 0)}</td>
            </tr>
        ];

        if (this.state.expandedRows.includes(index)) {
            itemRows.push(
                <div>
                    <p>
                        <strong>Email:</strong>{" "}
                        {supervisor.email}
                    </p>
                    <p>
                        <strong>General Info:</strong>{" "}
                        {supervisor.info}
                    </p>
                    <p>
                        <h5>Projects:</h5>{" "}
                        {/* Add a new line */}
                        {supervisor.projects?.map((project, index) => {
                            return (
                                <div>
                                    <p>
                                        <strong>Project Title:</strong>{" "}
                                        {project.title}
                                    </p>
                                    <p>
                                        <strong>Project Description:</strong>{" "}
                                        {project.description}
                                    </p>
                                </div>
                            )
                        })}
                    </p>
                </div>
            )
        }

        return itemRows;
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

        // @ts-ignore
        let allSupervisors = [];

        this.state.supervisors?.forEach((supervisor, index) => {
            const itemRows = this.renderItem(supervisor, index);
            // @ts-ignore
            allSupervisors = allSupervisors.concat(itemRows);
        });

        return (<div className="container">
            {(allSupervisors.length > 0) ? <div>
                <h1>Supervisors</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Areas of Interest</th>
                            <th>Slots Available</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/*// @ts-ignore*/}
                        {allSupervisors}
                    </tbody>
                </table>
            </div> : <div>Loading...</div>}
            </div>);
    }
}
