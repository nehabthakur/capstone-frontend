import {Component} from "react";
import {Redirect} from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";
import IStudent from "../types/student.type";
import UserService from "../services/user.service";
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from "formik";

type Props = {};

type State = {
    redirect: string | null, userReady: boolean,
    currentUser: IUser & { token: string },
    studentInfo: IStudent | null,
    loading: boolean
};

export default class StudentProject extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.updateInfo = this.updateInfo.bind(this);

        this.state = {
            redirect: null, userReady: false, currentUser: {token: ""},
            studentInfo: null, loading: false,
        };
    }

    validationSchema() {
        return Yup.object().shape({
            title: Yup.string()
                .required("title is required"),
            description: Yup.string()
                .required("Description is required")
        });
    }

    updateInfo(formValue: {title: string, description: string}) {
        this.setState({loading: true});
        UserService.updateStudentProjectInfo(formValue).then(
            () => {
                this.setState({loading: false});
                window.location.reload();
            },
            error => {
                alert(error.message);
                this.setState({loading: false});
            }
        );
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) {
            this.setState({redirect: "/login"});
        } else {
            UserService.getStudentOverview()
                .then(r => this.setState({studentInfo: r.data}));
        }

        this.setState({currentUser: currentUser, userReady: true, loading: false})
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

        let initialValues = {
            title: "",
            description: ""
        }

        if (this.state.studentInfo && this.state.studentInfo.project) {
            initialValues = {
                title: this.state.studentInfo.project.title ? this.state.studentInfo.project.title : "",
                description: this.state.studentInfo.project.description ? this.state.studentInfo.project.description : "",
            }
        }

        return (<div className="container">
            {(this.state.userReady) ? <div>
                <Formik enableReinitialize={true} initialValues={initialValues} validationSchema={this.validationSchema()} onSubmit={this.updateInfo}>
                    <Form>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <Field name="title" type="text" className="form-control" />
                            <ErrorMessage name="title" component="div" className="text-danger" />
                        </div>
                        {/*Make the description resizable*/}
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <Field name="description" as="textarea" className="form-control" />
                            <ErrorMessage name="description" component="div" className="text-danger" />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary" disabled={this.state.loading}>
                                {this.state.loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                <span>Update</span>
                            </button>
                        </div>
                    </Form>
                </Formik>
            {/*    // TODO GANTT chart*/}
            </div> : null}
        </div>);
    }
}
