import IUser from "./user.type";
import IProject from "./project.type";

export default interface IStudent {
    id?: any | null,
    email?: string | null,
    name?: string,
    supervisor?: IUser | null,
    project?: IProject | null
}
