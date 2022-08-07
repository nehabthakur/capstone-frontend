import {Component} from "react";
import {Redirect} from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";
import IStudent from "../types/student.type";
import UserService from "../services/user.service";
import * as Yup from 'yup';
import {ErrorMessage, Field, Form, Formik} from "formik";
import ISupervisor from "../types/supervisor.type";

type Props = {};

type State = {
    redirect: string | null, userReady: boolean, currentUser: IUser & { token: string }, studentInfo: IStudent | null, shortlisted_supervisors: Array<ISupervisor>, proposal_forms: Map<string, Map<string, string>>, selected_supervisor: string | null, proposal_form: {title: string, aim: string, rationale: string}
};

export default class StudentProjectProposal extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.updateInfo = this.updateInfo.bind(this);

        this.state = {
            redirect: null,
            userReady: false,
            currentUser: {token: ""},
            studentInfo: null,
            shortlisted_supervisors: [],
            proposal_forms: new Map<string, Map<string, string>>(),
            selected_supervisor: null,
            proposal_form: {title: "", aim: "", rationale: ""}
        };
    }

    validationSchema() {
        return Yup.object().shape({
            title: Yup.string()
                .required("title is required"), aim: Yup.string()
                .required("aim is required"), rationale: Yup.string()
                .required("rationale is required")
        });
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) {
            this.setState({redirect: "/login"});
        } else {
            UserService.getStudentOverview()
                .then(r => this.setState({studentInfo: r.data}));

            UserService.getSupervisorShortlist()
                .then(r => {
                    [r.data.supervisor_1, r.data.supervisor_2, r.data.supervisor_3, r.data.supervisor_4, r.data.supervisor_5]
                        .filter(email => email !== null)
                        .forEach(email => {
                            UserService.getSupervisorInfoByEmail(email)
                                .then(r => {
                                    this.state.shortlisted_supervisors.push(r.data);
                                    this.setState({shortlisted_supervisors: this.state.shortlisted_supervisors});
                                    UserService.getProposalForm(email)
                                        .then(r => {
                                            // convert r.data to a map in a single line
                                            const proposal_form: Map<string, string> = new Map(Object.entries(r.data));
                                            this.state.proposal_forms.set(email, proposal_form);
                                            this.setState({proposal_forms: this.state.proposal_forms});
                                        });
                                })
                        });
                });
        }

        this.setState({currentUser: currentUser, userReady: true})
    }

    updateInfo(formValue: { title: string, aim: string, rationale: string }) {
        if (this.state.selected_supervisor) {
            const request_body = {
                supervisor_email: this.state.selected_supervisor,
                title: formValue.title,
                aim: formValue.aim,
                rationale: formValue.rationale
            }

            UserService.postProjectProposal(request_body)
                .then(r => {
                    alert("Project proposal form sent");
                    window.location.reload();
                }).catch(e => alert("Error submitting proposal form"));
        }
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

        return (<div>
            <strong>Pick a supervisor to send the project proposal form</strong>
            <br/>
            <select
                value={this.state.selected_supervisor ? this.state.selected_supervisor : "Select a supervisor"}
                onChange={(eventKey) => {
                    if (eventKey) {
                        this.setState({selected_supervisor: eventKey.currentTarget.value});
                        const proposal_form = this.state.proposal_forms.get(eventKey.currentTarget.value);
                        if (proposal_form !== undefined) {
                            this.setState( {
                                proposal_form: {
                                    // @ts-ignore
                                    title: proposal_form.has("title") ? proposal_form.get("title") : "", // @ts-ignore
                                    aim: proposal_form.has("aim") ? proposal_form.get("aim") : "", // @ts-ignore
                                    rationale: proposal_form.has("rationale") ? proposal_form.get("rationale") : ""
                                }
                            });
                        }
                    }
                }}
            >
                <option value="noEmail">Select a supervisor</option>
                {this.state.shortlisted_supervisors.map(supervisor => {
                    // @ts-ignore
                    return <option value={supervisor.email}>{supervisor.name}</option>
                })}
            </select>
            {this.state.selected_supervisor && this.state.selected_supervisor !== "noEmail" && <Formik
                enableReinitialize={true}
                initialValues={this.state.proposal_form}
                validationSchema={this.validationSchema()}
                onSubmit={this.updateInfo}
            >
                <Form>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <Field name="title" type="text" className="form-control" />
                        <ErrorMessage name="title" component="div" className="text-danger"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="aim">Aim</label>
                        <Field name="aim" as="textarea" className="form-control" />
                        <ErrorMessage name="aim" component="div" className="text-danger"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="rationale">Rationale</label>
                        <Field name="rationale" as="textarea" className="form-control" />
                        <ErrorMessage name="rationale" component="div" className="text-danger"/>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary"
                                disabled={!this.state.selected_supervisor || this.state.selected_supervisor === "noEmail" || (this.state.proposal_form.title !== "" && this.state.proposal_form.aim !== "" && this.state.proposal_form.rationale !== "")}>
                            Submit
                        </button>
                    </div>
                </Form>
            </Formik>}
            {this.state.selected_supervisor && this.state.selected_supervisor !== "noEmail" && <div>
                <strong>Status:</strong>{" "}
                {this.state.proposal_forms.get(this.state.selected_supervisor)?.has("status") ? this.state.proposal_forms.get(this.state.selected_supervisor)?.get("status")?.toUpperCase() : "NOT SUBMITTED"}
                <br/>
                <strong>Comment:</strong>{" "}
                <br/>
                {this.state.proposal_forms.get(this.state.selected_supervisor)?.has("comment") ? this.state.proposal_forms.get(this.state.selected_supervisor)?.get("comment") : "No comment yet"}
            </div>}
        </div>);
    }
}
