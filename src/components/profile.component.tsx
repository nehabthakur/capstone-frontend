import {Component} from "react";
import {Redirect} from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";
import IStudent from "../types/student.type";
import ISupervisor from "../types/supervisor.type";
import UserService from "../services/user.service";

type Props = {};

type State = {
    redirect: string | null, userReady: boolean, currentUser: IUser & { token: string }, studentInfo: IStudent | null, supervisorInfo: ISupervisor | null,
}
export default class Profile extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            redirect: null, userReady: false, currentUser: {token: ""}, studentInfo: null, supervisorInfo: null,
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) this.setState({redirect: "/login"});

        if (currentUser.roles && currentUser.email && (currentUser.roles.includes("student"))) {
            UserService.getStudentBoard(currentUser.email).then(response => {
                this.setState({studentInfo: response.data});
            });
        }

        if (currentUser.roles && currentUser.email && (currentUser.roles.includes("supervisor"))) {
            UserService.getSupervisorBoard(currentUser.email).then(response => {
                this.setState({supervisorInfo: response.data});
            });
        }

        // if (currentUser.roles && currentUser.email && (currentUser.roles.includes("project_coordinator"))) {
        //     UserService.getProjectCoordinatorBoard(currentUser.email).then(response => {
        //         this.setState({supervisorInfo: response.data});
        //     });
        // }

        this.setState({currentUser: currentUser, userReady: true})
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>
        }

        const {currentUser} = this.state;

        return (<div className="container">
            {(this.state.userReady) ? <div>
                <header>
                    <h2>
                        <strong>{currentUser.name}</strong>'s Profile
                    </h2>
                </header>
                <br/>
                <p>
                    <strong>Token:</strong>{" "}
                    {currentUser.token.substring(0, 20)}
                </p>
                <p>
                    <strong>Email:</strong>{" "}
                    {currentUser.email}
                </p>
                <p>
                    <strong>Name:</strong>{" "}
                    {currentUser.name}
                </p>
                <strong>Roles:</strong>
                <ul>
                    {currentUser.roles && currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
                </ul>
            </div> : null}

            {(this.state.supervisorInfo) ? <div>
                <br/>
                <header>
                    <h2>
                        <strong>{currentUser.name}</strong>'s Supervisor Board
                    </h2>
                </header>
                <br/>
                <p>
                    <strong>Areas of Expertise:</strong>{" "}
                    {this.state.supervisorInfo.areas}
                </p>
                <p>
                    <strong>General Info:</strong>{" "}
                    {this.state.supervisorInfo.info}
                </p>
                <p>
                    <strong>Project ideas:</strong>{" "}
                    {/*convert list of project ideas of type IProject into one project idea per line*/}
                    {this.state.supervisorInfo.projects?.map((projectIdea, index) => <li key={index}>{projectIdea}</li>)}
                </p>
                <p>
                    <strong>Supervisees:</strong>{" "}
                    {/*convert list of students into comma seperated string*/}
                    {this.state.supervisorInfo.students?.map((student, index) => <li key={index}>{student.name}</li>)}
                </p>
                <p>
                    <strong>Slots:</strong>{" "}
                    {this.state.supervisorInfo.slots}
                </p>
            </div> : null}
        </div>);
    }
}
