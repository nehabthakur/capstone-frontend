import React, {Component, FormEvent} from "react";
import {Redirect} from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";
import UserService from "../services/user.service";
import ISupervisor from "../types/supervisor.type";

type Props = {};

type State = {
    redirect: string | null, userReady: boolean, currentUser: IUser & { token: string }, supervisors: Array<ISupervisor> | null,
    supervisor_1: ISupervisor | null, supervisor_2: ISupervisor | null, supervisor_3: ISupervisor | null,
    supervisor_4: ISupervisor | null, supervisor_5: ISupervisor | null
}

export default class StudentShortlist extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            redirect: null, userReady: false, currentUser: {token: ""}, supervisors: null,
            supervisor_1: null, supervisor_2: null, supervisor_3: null,
            supervisor_4: null, supervisor_5: null
        };

        this.handleSelectValue = this.handleSelectValue.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleSelectValue = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const variable = event.target.id;
        const email = event.target.value;

        const supervisor = this.state.supervisors?.find(supervisor => supervisor.email === email);

        if (variable === "supervisor_1" && supervisor !== undefined) {
            this.setState({supervisor_1: supervisor});
        } else if (variable === "supervisor_2" && supervisor !== undefined) {
            this.setState({supervisor_2: supervisor});
        } else if (variable === "supervisor_3" && supervisor !== undefined) {
            this.setState({supervisor_3: supervisor});
        } else if (variable === "supervisor_4" && supervisor !== undefined) {
            this.setState({supervisor_4: supervisor});
        } else if (variable === "supervisor_5" && supervisor !== undefined) {
            this.setState({supervisor_5: supervisor});
        }
    }

    handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        UserService.postSupervisorShortlist(
            this.state.supervisor_1?.email, this.state.supervisor_2?.email,
            this.state.supervisor_3?.email, this.state.supervisor_4?.email,
            this.state.supervisor_5?.email)
        .then(
            (response) => {
                if (response.status === 200) {
                    alert("Shortlist successfully submitted!");
                    this.setState({redirect: "/student/shortlist"});
                } else {
                    alert("Something went wrong!");
                }
            }
        )
    };

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) {
            this.setState({redirect: "/login"});
        } else {
            UserService.getSupervisors()
                .then(r => this.setState({supervisors: r.data}));

            UserService.getSupervisorShortlist()
                .then(r => {
                    this.setState({
                        supervisor_1: r.data.supervisor_1,
                        supervisor_2: r.data.supervisor_2,
                        supervisor_3: r.data.supervisor_3,
                        supervisor_4: r.data.supervisor_4,
                        supervisor_5: r.data.supervisor_5
                    });
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
            {(this.state.userReady && this.state.supervisors) ?
            <div>
                <strong>Please select 5 unique supervisors</strong>
                <br/>
                <form onSubmit={this.handleFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="supervisor_1">Supervisor 1</label>
                    <select
                      // @ts-ignore
                      value={this.state.supervisor_1?.email}
                      onChange={this.handleSelectValue}
                      className="form-control"
                      id="supervisor_1"
                    >
                    {this.state.supervisor_1 ?
                        // @ts-ignore
                        <option value={this.state.supervisor_1.email}>{this.state.supervisor_1.name}</option>
                        : <option value="noEmail">Select a supervisor</option>}
                        {this.state.supervisors.map(supervisor => {
                            return (
                                // @ts-ignore
                                <option value={supervisor.email}>{supervisor.name}</option>
                            )
                        })}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                </form>
                <form onSubmit={this.handleFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="supervisor_2">Supervisor 2</label>
                    <select
                      // @ts-ignore
                      value={this.state.supervisor_2?.email}
                      onChange={this.handleSelectValue}
                      className="form-control"
                      id="supervisor_2"
                    >
                      <option value="noEmail">Select a supervisor</option>
                        {this.state.supervisors.map(supervisor => {
                            return (
                                // @ts-ignore
                                <option value={supervisor.email}>{supervisor.name}</option>
                            )
                        })}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={this.state.supervisor_2?.email === "noEmail"}
                  >
                    Submit
                  </button>
                </form>
                <form onSubmit={this.handleFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="supervisor_3">Supervisor 3</label>
                    <select
                      // @ts-ignore
                      value={this.state.supervisor_3?.email}
                      onChange={this.handleSelectValue}
                      className="form-control"
                      id="supervisor_3"
                    >
                      <option value="noEmail">Select a supervisor</option>
                        {this.state.supervisors.map(supervisor => {
                            return (
                                // @ts-ignore
                                <option value={supervisor.email}>{supervisor.name}</option>
                            )
                        })}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={this.state.supervisor_3?.email === "noEmail"}
                  >
                    Submit
                  </button>
                </form>
                <form onSubmit={this.handleFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="supervisor_4">Supervisor 4</label>
                    <select
                      // @ts-ignore
                      value={this.state.supervisor_4?.email}
                      onChange={this.handleSelectValue}
                      className="form-control"
                      id="supervisor_4"
                    >
                      <option value="noEmail">Select a supervisor</option>
                        {this.state.supervisors.map(supervisor => {
                            return (
                                // @ts-ignore
                                <option value={supervisor.email}>{supervisor.name}</option>
                            )
                        })}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={this.state.supervisor_4?.email === "noEmail"}
                  >
                    Submit
                  </button>
                </form>
                <form onSubmit={this.handleFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="supervisor_5">Supervisor 5</label>
                    <select
                      // @ts-ignore
                      value={this.state.supervisor_5?.email}
                      onChange={this.handleSelectValue}
                      className="form-control"
                      id="supervisor_5"
                    >
                      <option value="noEmail">Select a supervisor</option>
                        {this.state.supervisors.map(supervisor => {
                            return (
                                // @ts-ignore
                                <option value={supervisor.email}>{supervisor.name}</option>
                            )
                        })}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={this.state.supervisor_5?.email === "noEmail"}
                  >
                    Submit
                  </button>
                </form>
            </div> : null}
        </div>);
    }
}
