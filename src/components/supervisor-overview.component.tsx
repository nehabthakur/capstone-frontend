import {Component, Key} from "react";
import {Redirect} from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";
import UserService from "../services/user.service";
import ISupervisor from "../types/supervisor.type";
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from "formik";

type Props = {};

type State = {
    redirect: string | null, userReady: boolean, currentUser: IUser & { token: string },
    supervisorInfo: ISupervisor | null, loading: boolean
}

export default class SupervisorOverview extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.updateInfo = this.updateInfo.bind(this);

        this.state = {
            redirect: null, userReady: false, currentUser: {token: ""},
            supervisorInfo: null, loading: false
        };
    }

    validationSchema() {
        return Yup.object().shape({
            areas: Yup.string().required("Areas of interest is required!"),
            info: Yup.string().required("General info is required!")
        });
    }

    updateInfo(formValue: {areas: string, info: string, projects: {title: string, description: string}[]}) {
        this.setState({loading: true});
        console.log(formValue);
        UserService.updateSupervisorProjectInfo(formValue).then(
            () => {
                this.setState({loading: false});
                window.location.reload();
            },
            error => {
                this.setState({loading: false});
                alert(error.message);
            }
        );
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) {
            this.setState({redirect: "/login"});
        } else {
            UserService.getSupervisorOverview()
                .then(r => this.setState({supervisorInfo: r.data}));
        }

        this.setState({currentUser: currentUser, userReady: true, loading: false});
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>
        }

        const {currentUser} = this.state;

        if (!currentUser.roles?.includes("supervisor")) {
            return <div>Unauthorized</div>
        }

        let initialValues = {
            email: "",
            name: "",
            slots: 0,
            slots_available: 0,
            supervisor_id: "",
            areas: "",
            info: "",
            projects: [{title: "", description: ""}]
        }

        if (this.state.supervisorInfo) {
            initialValues = {
                email: this.state.supervisorInfo.email ? this.state.supervisorInfo.email : "",
                name: this.state.supervisorInfo.name ? this.state.supervisorInfo.name : "",
                slots: this.state.supervisorInfo.slots ? this.state.supervisorInfo.slots : 0,
                slots_available: (this.state.supervisorInfo.slots ? this.state.supervisorInfo.slots : 0) - (this.state.supervisorInfo.students ? this.state.supervisorInfo.students.length : 0),
                supervisor_id: this.state.supervisorInfo.id ? this.state.supervisorInfo.id : "",
                areas: this.state.supervisorInfo.areas ? this.state.supervisorInfo.areas : "",
                info: this.state.supervisorInfo.info ? this.state.supervisorInfo.info : "",
                projects: this.state.supervisorInfo.projects ? this.state.supervisorInfo.projects.map(r => {return {'title': r.title ? r.title : "", 'description': r.description ? r.description : ""}}) : [{title: "", description: ""}]
            }
        }

        return (<div className="container">
            {(this.state.userReady) ? <div>
                <Formik enableReinitialize={true} initialValues={initialValues} onSubmit={this.updateInfo} validationSchema={this.validationSchema}>
                    <Form>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <Field type="text" name="email" className="form-control" disabled={true}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <Field type="text" name="name" className="form-control" disabled={true}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="slots">Slots</label>
                            <Field type="number" name="slots" className="form-control" disabled={true}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="slots_available">Slots Available</label>
                            <Field type="text" name="slots_available" className="form-control" disabled={true}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="supervisor_id">Supervisor ID</label>
                            <Field type="text" name="supervisor_id" className="form-control" disabled={true}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="areas">Areas of Interest</label>
                            <Field type="text" name="areas" className="form-control"/>
                            <ErrorMessage name="areas" component="div" className="text-danger"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="info">General Info</label>
                            <Field as="textarea" name="info" className="form-control"/>
                            <ErrorMessage name="info" component="div" className="text-danger"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="projects">Projects</label>
                            <Field name="projects" render={
                                // @ts-ignore
                                ({field, form}) => {
                                return <div>
                                    {field.value.map((project: {title: string, description: string}, index: Key) => {
                                        return <div key={index}>
                                            <label htmlFor={`projects[${index}].title`}>Title</label>
                                            <Field type="text" name={`projects[${index}].title`} className="form-control"/>
                                            <ErrorMessage name={`projects[${index}].title`} component="div" className="text-danger"/>
                                            <label htmlFor={`projects[${index}].description`}>Description</label>
                                            <Field as="textarea" name={`projects[${index}].description`} className="form-control"/>
                                            <ErrorMessage name={`projects[${index}].description`} component="div" className="text-danger"/>
                                        </div>
                                    })}
                                    <button type="button" onClick={() => form.setFieldValue('projects', [...field.value, {title: "", description: ""}])}>Add Project</button>
                                </div>
                            }}/>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </Form>
                </Formik>
            </div> : null}
        </div>);
    }
}
