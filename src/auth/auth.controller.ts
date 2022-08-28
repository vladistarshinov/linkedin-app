import {Body, Controller, Post} from '@nestjs/common';
import {UserDto} from "../user/dto/user.dto";
import {catchError, map, Observable, throwError} from "rxjs";
import {User} from "../user/interfaces/user.interface";
import {UserAuthService} from "./services/user-auth/user-auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly userAuthService: UserAuthService) {}

    @Post('login')
    public login(@Body() user: UserDto): Observable<Object> {
        return this.userAuthService.login(user)
            .pipe(
                map((jwt: string) => {
                    return { access_token: jwt }
                }),
                catchError(error => throwError(error))
            );
    }

    @Post('register')
    public create(@Body() user: UserDto): Observable<Omit<User, 'password'> | Object> {
        return this.userAuthService.create(user);
    }

}
