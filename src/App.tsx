import { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
import IUser from './types/user.type';

import Login from "./components/login.component";
import Profile from "./components/profile.component";

import EventBus from "./common/EventBus";
import StudentOverview from "./components/student-overview.component";
import StudentProject from "./components/student-project-info.component";
import SupervisorsList from "./components/supervisor-list.component";
import StudentShortlist from "./components/student-shortlist.component";
import SupervisorOverview from "./components/supervisor-overview.component";
import Admin from "./components/admin.component";
import StudentProjectProposal from "./components/student-project-proposal.component";
import SupervisorSupervisees from "./components/supervisor-supervisees.component";
import UserList from "./components/user-list.component";

type Props = {};

type State = {
  showStudentBoard: boolean,
  showSupervisorBoard: boolean,
  showExaminerBoard: boolean,
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
      showExaminerBoard: false,
      showProjectCoordinatorBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showStudentBoard: user.roles.includes("student"),
        showSupervisorBoard: user.roles.includes("supervisor"),
        showExaminerBoard: user.roles.includes("examiner"),
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
      showExaminerBoard: false,
      showProjectCoordinatorBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showStudentBoard, showSupervisorBoard, showExaminerBoard, showProjectCoordinatorBoard } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Capstone Project
          </Link>
          <div className="navbar-nav mr-auto">
            {showSupervisorBoard && (
              <li className="nav-item">
                <Link to={"/supervisor/overview"} className="nav-link">
                  Overview
                </Link>
              </li>
            )}

            {showSupervisorBoard && (
              <li className="nav-item">
                <Link to={"/supervisor/supervisees"} className="nav-link">
                  Supervisees
                </Link>
              </li>
            )}

            {showProjectCoordinatorBoard && (
              <li className="nav-item">
                <Link to={"/project_coordinator"} className="nav-link">
                  Admin
                </Link>
              </li>
            )}

            {showProjectCoordinatorBoard && (
              <li className="nav-item">
                <Link to={"/project_coordinator/user_list"} className="nav-link">
                    User List
                </Link>
                </li>
            )}

            {showStudentBoard && (
              <li className="nav-item">
                <Link to={"/student/overview"} className="nav-link">
                  Overview
                </Link>
              </li>
            )}
            {showStudentBoard && (
              <li className="nav-item">
                <Link to={"/student/project"} className="nav-link">
                  Project Info
                </Link>
              </li>
            )}
            {showStudentBoard && (
              <li className="nav-item">
                <Link to={"/supervisors"} className="nav-link">
                  Supervisors
                </Link>
              </li>
            )}
            {showStudentBoard && (
              <li className="nav-item">
                <Link to={"/student/shortlist"} className="nav-link">
                  Shortlist Supervisors
                </Link>
              </li>
            )}
            {showStudentBoard && (
              <li className="nav-item">
                <Link to={"/student/project_proposal"} className="nav-link">
                  Project Proposal
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
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/profile"]} component={Profile} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/student/overview" component={StudentOverview} />
            <Route exact path="/student/project" component={StudentProject} />
            <Route exact path="/supervisors" component={SupervisorsList} />
            <Route exact path="/student/shortlist" component={StudentShortlist} />
            <Route exact path="/supervisor/overview" component={SupervisorOverview} />
            <Route exact path="/project_coordinator" component={Admin} />
            <Route exact path="/project_coordinator/user_list" component={UserList} />
            <Route exact path="/student/project_proposal" component={StudentProjectProposal} />
            <Route exact path="/supervisor/supervisees" component={SupervisorSupervisees} />
          </Switch>
        </div>

        {/*{ <AuthVerify logOut={this.logOut}/>}*/}
      </div>
    );
  }
}

export default App;
