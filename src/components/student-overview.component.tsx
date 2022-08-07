import {Component} from "react";
import {Redirect} from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";
import IStudent from "../types/student.type";
import UserService from "../services/user.service";

type Props = {};

type State = {
    redirect: string | null, userReady: boolean, currentUser: IUser & { token: string }, studentInfo: IStudent | null,
}

export default class StudentOverview extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            redirect: null, userReady: false, currentUser: {token: ""}, studentInfo: null
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) {
            this.setState({redirect: "/login"});
        } else {
            UserService.getStudentOverview()
                .then(r => this.setState({studentInfo: r.data}));
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
            {(this.state.userReady) ? <div>
                <p>
                    <strong>Email:</strong>{" "}
                    {currentUser.email}
                </p>
                <p>
                    <strong>Name:</strong>{" "}
                    {currentUser.name}
                </p>
                <p>
                    <strong>Student id:</strong>
                    {this.state.studentInfo && this.state.studentInfo.id}
                </p>
                <p>
                    <strong>Supervisor Name:</strong>{" "}
                    {this.state.studentInfo && this.state.studentInfo.supervisor?.name}
                </p>
                <p>
                    <strong>Supervisor Email:</strong>{" "}
                    {this.state.studentInfo && this.state.studentInfo.supervisor?.email}
                </p>
                <p>
                    <strong>Second Examiner Name:</strong>{" "}
                    {this.state.studentInfo && this.state.studentInfo.second_examiner?.name}
                </p>
                <p>
                    <strong>Second Examiner Email:</strong>{" "}
                    {this.state.studentInfo && this.state.studentInfo.second_examiner?.email}
                </p>
                <p>
                    <strong>Final Grade:</strong>{" "}
                    {this.state.studentInfo && this.state.studentInfo.final_grade}
                </p>
                <p>
                    <strong>Final Grade feedback:</strong>
                    {this.state.studentInfo && this.state.studentInfo.feedback}
                </p>
            </div> : null}
        </div>);
    }
}
