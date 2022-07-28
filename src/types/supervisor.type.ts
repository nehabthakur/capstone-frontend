import IProject from "./project.type";
import IStudent from "./student.type";

export default interface ISupervisor {
    id?: any | null,
    email?: string | null,
    name?: string | null,
    info?: string | null,
    areas?: Array<string> | null,
    students?: Array<IStudent> | null,
    projects?: Array<IProject> | null,
    slots?: Array<string> | null
}