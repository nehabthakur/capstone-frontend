import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";
import UserService from "../services/user.service";
import ISupervisor from "../types/supervisor.type";
import { Formik, Field, Form } from "formik";

type Props = {};

type State = {
    redirect: string | null, userReady: boolean, currentUser: IUser & { token: string }, supervisors: Array<ISupervisor> | null,
    supervisor_1: ISupervisor | null, supervisor_2: ISupervisor | null, supervisor_3: ISupervisor | null,
    supervisor_4: ISupervisor | null, supervisor_5: ISupervisor | null, loading: boolean
}

export default class StudentShortlist extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            redirect: null, userReady: false, currentUser: {token: ""}, supervisors: null,
            supervisor_1: null, supervisor_2: null, supervisor_3: null,
            supervisor_4: null, supervisor_5: null, loading: false,
        };
    }

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

        this.setState({currentUser: currentUser, userReady: true, loading: false})
    }

    handleFormSubmit = (event: { supervisor_1: any, supervisor_2: any, supervisor_3: any, supervisor_4: any, supervisor_5: any }) => {
        this.setState({loading: true});
        UserService.postSupervisorShortlist(
            event.supervisor_1,
            event.supervisor_2,
            event.supervisor_3,
            event.supervisor_4,
            event.supervisor_5
        ).then(
            (response) => {
                if (response.status === 200) {
                    alert("Shortlist successfully submitted!");
                    this.setState({redirect: "/student/shortlist"});
                } else {
                    alert("Something went wrong!");
                }
                window.location.reload();
            }
        )

        this.setState({loading: false});
    };


    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>
        }

        const {currentUser} = this.state;

        // display unauthorized if user is not student
        if (!currentUser.roles?.includes("student")) {
            return <div>Unauthorized</div>
        }

        let initialValues = {
            supervisor_1: this.state.supervisor_1 ? this.state.supervisor_1 : null,
            supervisor_2: this.state.supervisor_2 ? this.state.supervisor_2 : null,
            supervisor_3: this.state.supervisor_3 ? this.state.supervisor_3 : null,
            supervisor_4: this.state.supervisor_4 ? this.state.supervisor_4 : null,
            supervisor_5: this.state.supervisor_5 ? this.state.supervisor_5 : null
        }

        return (
            <div className="container">
                {(this.state.userReady && this.state.supervisors && this.state.supervisors.length > 0) ?
                    <div>
                        <h3>Please select 5 unique supervisors</h3>
                        {/*//@ts-ignore*/}
                        <Formik enableReinitialize={true} initialValues={initialValues} onSubmit={this.handleFormSubmit}>
                            <Form>
                                <label>Supervisor 1</label>
                                <Field as="select" name="supervisor_1" disabled={!!this.state.supervisor_1}>
                                    <option value="noEmail">Select a supervisor</option>
                                    {this.state.supervisors.map((supervisor: ISupervisor) => {
                                       return <option value={supervisor.email ? supervisor.email : "noEmail"}>{supervisor.name}</option>
                                    })};
                                </Field>
                                <label>Supervisor 2</label>
                                <Field as="select" name="supervisor_2" disabled={!!this.state.supervisor_2}>
                                    <option value="noEmail">Select a supervisor</option>
                                    {this.state.supervisors.map((supervisor: ISupervisor) => {
                                       return <option value={supervisor.email ? supervisor.email : "noEmail"}>{supervisor.name}</option>
                                    })};
                                </Field>
                                <label>Supervisor 3</label>
                                <Field as="select" name="supervisor_3" disabled={!!this.state.supervisor_3}>
                                    <option value="noEmail">Select a supervisor</option>
                                    {this.state.supervisors.map((supervisor: ISupervisor) => {
                                       return <option value={supervisor.email ? supervisor.email : "noEmail"}>{supervisor.name}</option>
                                    })};
                                </Field>
                                <label>Supervisor 4</label>
                                <Field as="select" name="supervisor_4" disabled={!!this.state.supervisor_4}>
                                    <option value="noEmail">Select a supervisor</option>
                                    {this.state.supervisors.map((supervisor: ISupervisor) => {
                                       return <option value={supervisor.email ? supervisor.email : "noEmail"}>{supervisor.name}</option>
                                    })};
                                </Field>
                                <label>Supervisor 5</label>
                                <Field as="select" name="supervisor_5" disabled={!!this.state.supervisor_5}>
                                    <option value="noEmail">Select a supervisor</option>
                                    {this.state.supervisors.map((supervisor: ISupervisor) => {
                                       return <option value={supervisor.email ? supervisor.email : "noEmail"}>{supervisor.name}</option>
                                    })};
                                </Field>
                                <br/>
                                <br/>
                                <button type="submit" className="btn btn-primary" disabled={this.state.loading}>
                                {this.state.loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                <span>Submit</span>
                            </button>
                            </Form>
                        </Formik>
                    </div> : <div>Loading...</div>}
            </div>
        );
    }
}
