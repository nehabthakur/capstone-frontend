import {Component} from "react";
import {Redirect} from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";

type Props = {};

type State = {
    redirect: string | null, userReady: boolean, currentUser: IUser & { token: string }
}
export default class Profile extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            redirect: null, userReady: false, currentUser: {token: ""}
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) this.setState({redirect: "/login"});
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
        </div>);
    }
}
