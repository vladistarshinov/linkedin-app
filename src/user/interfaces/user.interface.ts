import {UserRole} from "./role.interface";

export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
}
