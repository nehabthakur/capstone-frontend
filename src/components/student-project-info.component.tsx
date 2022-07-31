import {Component} from "react";
import {Redirect} from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";
import IStudent from "../types/student.type";
import UserService from "../services/user.service";

type Props = {};

type State = {
    redirect: string | null, userReady: boolean,
    currentUser: IUser & { token: string },
    studentInfo: IStudent | null,
}

export default class StudentProject extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            redirect: null, userReady: false, currentUser: {token: ""},
            studentInfo: null
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
                    <strong>Project title:</strong>
                    {this.state.studentInfo && this.state.studentInfo.project?.name}
                </p>
                <p>
                    <strong>Project description:</strong>
                    {this.state.studentInfo && this.state.studentInfo.project?.description}
                </p>
                <p>
                    {/*# TODO populate it*/}
                    <strong>Project deadline:</strong>
                    {""}
                </p>
                <p>
                    {/*# TODO populate it*/}
                    <strong>Gantt Chart:</strong>
                    {""}
                </p>
            </div> : null}
        </div>);
    }
}
