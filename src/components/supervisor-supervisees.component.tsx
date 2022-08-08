import {Component} from "react";
import {Redirect} from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";
import UserService from "../services/user.service";
import ISupervisor from "../types/supervisor.type";
import IStudent from "../types/student.type";
import {Field, Form, Formik} from "formik";

type Props = {};

type State = {
    redirect: string | null, userReady: boolean, currentUser: IUser & { token: string }, supervisorInfo: ISupervisor | null,
    pending_proposals: Array<{ title: string, aim: string, rationale: string, status: string, student_info: IStudent }>, expanded_rows_pending: Array<number>,
    expanded_rows_current: Array<number>, current_students: Array<IStudent>
};

export default class SupervisorSupervisees extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            redirect: null,
            userReady: false,
            currentUser: {token: ""},
            supervisorInfo: null,
            pending_proposals: [],
            expanded_rows_pending: [],
            current_students: [],
            expanded_rows_current: []
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) {
            this.setState({redirect: "/login"});
        } else {
            UserService.getSupervisorInfo()
                .then(r => this.setState({supervisorInfo: r.data}));

            UserService.getSupervisorPendingProposals()
                .then(r => this.setState({pending_proposals: r.data}));

            UserService.getSupervisorSupervisees()
                .then(r => this.setState({current_students: r.data}));
        }

        this.setState({currentUser: currentUser, userReady: true})
    }

    handlePendingProposalRowClick = (id: number) => {
        const currentExpandedRows = this.state.expanded_rows_pending;
        const isRowCurrentlyExpanded = currentExpandedRows.includes(id);

        const newExpandedRows = isRowCurrentlyExpanded ? currentExpandedRows.filter(row => row !== id) : currentExpandedRows.concat(id);
        this.setState({expanded_rows_pending: newExpandedRows});
    }

    handleCurrentProjectRowClick = (id: number) => {
        const currentExpandedRows = this.state.expanded_rows_current;
        const isRowCurrentlyExpanded = currentExpandedRows.includes(id);

        const newExpandedRows = isRowCurrentlyExpanded ? currentExpandedRows.filter(row => row !== id) : currentExpandedRows.concat(id);
        this.setState({expanded_rows_current: newExpandedRows});
    }

    renderPendingProposals = (proposal_form: { title: string, aim: string, rationale: string, status: string, student_info: IStudent }, index: number) => {
        const clickCallback = () => this.handlePendingProposalRowClick(index);
        const itemRows = [
            <tr key={index} onClick={clickCallback}>
                <td>{proposal_form.student_info.name}</td>
                <td>{proposal_form.title}</td>
            </tr>
        ];

        if (this.state.expanded_rows_pending.includes(index)) {
            itemRows.push(
                <div>
                    <p>
                        <strong>Email:</strong> {" "}
                        {proposal_form.student_info.email}
                    </p>
                    <p>
                        <strong>Aim:</strong> {" "}
                        {proposal_form.aim}
                    </p>
                    <p>
                        <strong>Rationale:</strong> {" "}
                        {proposal_form.rationale}
                    </p>
                    <Formik onSubmit={(values: {status: string, comment: string}, {setSubmitting}) => {
                        UserService.updateSupervisorPendingProposal(proposal_form.student_info.email ? proposal_form.student_info.email : "", values.status, values.comment)
                            .then(r => {
                                this.setState({pending_proposals: r.data});
                            }).catch(e => {
                            console.log(e);
                            }).finally(() => {
                                setSubmitting(false);
                            }
                        );
                    }} initialValues={{status: proposal_form.status, comment: ""}}>
                        <Form>
                            <Field type="radio" name="status" value="accepted"/> Accept
                            <br/>
                            <Field type="radio" name="status" value="rejected"/> Reject
                            <br/>
                            <Field type="text" name="comment" placeholder="Comment"/>
                            <br/>
                            <button type="submit">Submit</button>
                        </Form>
                    </Formik>
                </div>
            )
        }

        return itemRows;
    }

    renderCurrentProjects = (student_info: IStudent, index: number) => {
        const clickCallback = () => this.handleCurrentProjectRowClick(index);
        const itemRows = [
            <tr key={index} onClick={clickCallback}>
                <td>{student_info.name}</td>
                <td>{student_info.email}</td>
            </tr>
        ];

        if (this.state.expanded_rows_current.includes(index)) {
            itemRows.push(
                <div>
                    <p>
                        <strong>Title:</strong> {" "}
                        {student_info.project?.title}
                    </p>
                    <p>
                        <strong>Description:</strong> {" "}
                        {student_info.project?.description}
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

        if (!currentUser.roles?.includes("supervisor")) {
            return <div>Unauthorized</div>
        }

        const allPendingProposals = this.state.pending_proposals?.map((proposal_form, index) => this.renderPendingProposals(proposal_form, index));
        const allCurrentStudents = this.state.current_students?.map((student, index) => this.renderCurrentProjects(student, index));

        return (<div>
            {this.state.pending_proposals && this.state.pending_proposals.length > 0 ? <div>
                <h2>Pending project proposals</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Title</th>
                    </tr>
                    </thead>
                    <tbody>
                    {allPendingProposals}
                    </tbody>
                </table>
            </div> : <div><h2>No pending project proposals</h2></div>}
            {this.state.current_students && this.state.current_students.length > 0 ? <div>
                <h2>Current Supervisees</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Title</th>
                    </tr>
                    </thead>
                    <tbody>
                    {allCurrentStudents}
                    </tbody>
                </table>
            </div> : <div><h2>No current supervisees</h2></div>}
        </div>);
    }
}
