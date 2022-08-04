import IProject from "./project.type";
import IStudent from "./student.type";

export default interface ISupervisor {
    id?: string | null,
    email?: string | null,
    name?: string | null,
    info?: string | null,
    areas?: string | null,
    students?: Array<IStudent> | null,
    projects?: Array<IProject> | null,
    slots?: number | null
}