import { Injectable } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UserDto} from "../../../user/dto/user.dto";
import {from, Observable} from "rxjs";
import {hash, compare} from 'bcryptjs'

@Injectable()
export class JwtAuthService {
    constructor(private readonly jwtService: JwtService) {}

    public generateToken(user: UserDto): Observable<string> {
        return from(this.jwtService.signAsync(user));
    }

    public hashPassword(password: string): Observable<string> {
        return from<string>(hash(password, 10));
    }

    public comparePasswords(
        newPassword: string,
        passwordHash: string
    ): Observable<any | boolean> {
        return from<any | boolean>(compare(newPassword, passwordHash));
    }
}
