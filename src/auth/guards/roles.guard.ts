import {Injectable, CanActivate, ExecutionContext, ForbiddenException} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {map, Observable} from "rxjs";
import {User} from "../../user/interfaces/user.interface";
import {UserAuthService} from "../services/user-auth/user-auth.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private userAuthService: UserAuthService
    ) {}

    canActivate(context: ExecutionContext): boolean | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user: User = request.user;
        return this.userAuthService.findByMail(user.email)
            .pipe(
                map((user: User) => {
                    const hasPermission: boolean = roles.indexOf(user.role) > -1;
                    if (!hasPermission) throw new ForbiddenException('У вас нет доступа!')
                    return user && hasPermission;
                })
            );
    }
}