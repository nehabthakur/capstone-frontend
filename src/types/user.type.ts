export default interface IUser {
  id?: any | null,
  email?: string | null,
  password?: string,
  name?: string,
  roles?: Array<string>
}