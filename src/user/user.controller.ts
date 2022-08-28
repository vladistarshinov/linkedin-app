import {Body, Controller, Delete, Get, Param, Put, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {Observable} from "rxjs";
import {User} from "./interfaces/user.interface";
import {UserDto} from "./dto/user.dto";
import {UpdateResult} from "typeorm";
import {HasRoles} from "../auth/decorator/roles.decorator";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {UserRole} from "./interfaces/role.interface";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @HasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    public getAll(): Observable<User[]> {
        return this.userService.getAll();
    }

    @Get(':id')
    public getById(@Param() params: any): Observable<Omit<User, 'password'>> {
        return this.userService.findById(params.id);
    }

    @Put(':id')
    public update(
        @Param('id') id: string,
        @Body() user: UserDto
    ): Observable<any> {
        return this.userService.updateUserData(id, user);
    }

    @HasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id/role')
    public updateRole(
        @Param('id') id: string,
        @Body() user: UserDto
    ): Observable<UpdateResult> {
        return this.userService.updateRole(id, user);
    }

    @HasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    public delete(@Param('id') id: string): Observable<any> {
        return this.userService.deleteAccount(id);
    }
}
