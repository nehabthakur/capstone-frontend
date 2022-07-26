import { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
import IUser from './types/user.type';

import Login from "./components/login.component";
import Register from "./components/register.component";
import Profile from "./components/profile.component";

import EventBus from "./common/EventBus";
import BoardProjectCoordinator from "./components/board-project-coordinator.component";
import BoardSupervisor from "./components/board-supervisor.component";
import BoardStudent from "./components/board-student.component";

type Props = {};

type State = {
  showStudentBoard: boolean,
  showSupervisorBoard: boolean,
  showProjectCoordinatorBoard: boolean,
  currentUser: IUser | undefined
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showStudentBoard: false,
      showSupervisorBoard: false,
      showProjectCoordinatorBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    console.log(user);

    if (user) {
      this.setState({
        currentUser: user,
        showStudentBoard: user.roles.includes("student"),
        showSupervisorBoard: user.roles.includes("supervisor"),
        showProjectCoordinatorBoard: user.roles.includes("project_coordinator"),
      });
    }

    EventBus.on("logout", this.logOut);
  }

  componentWillUnmount() {
    EventBus.remove("logout", this.logOut);
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showStudentBoard: false,
      showSupervisorBoard: false,
      showProjectCoordinatorBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showStudentBoard, showSupervisorBoard, showProjectCoordinatorBoard } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Capstone Project
          </Link>
          <div className="navbar-nav mr-auto">
            {showSupervisorBoard && (
              <li className="nav-item">
                <Link to={"/supervisor"} className="nav-link">
                  Supervisor Board
                </Link>
              </li>
            )}

            {showProjectCoordinatorBoard && (
              <li className="nav-item">
                <Link to={"/head_supervisor"} className="nav-link">
                  Project Coordinator Board
                </Link>
              </li>
            )}

            {showStudentBoard && (
              <li className="nav-item">
                <Link to={"/student"} className="nav-link">
                  Student Board
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.name}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  Logout
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/profile"]} component={Profile} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/student" component={BoardStudent} />
            <Route exact path="/supervisor" component={BoardSupervisor} />
            <Route exact path="/project_coordinator" component={BoardProjectCoordinator} />
          </Switch>
        </div>

        {/*{ <AuthVerify logOut={this.logOut}/>}*/}
      </div>
    );
  }
}

export default App;