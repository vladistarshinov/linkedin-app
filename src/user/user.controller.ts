import {Body, Controller, Delete, Get, Param, Put} from '@nestjs/common';
import {UserService} from "./user.service";
import {Observable} from "rxjs";
import {User} from "./interfaces/user.interface";
import {UserDto} from "./dto/user.dto";
import {UpdateResult} from "typeorm";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

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

    @Put(':id/role')
    public updateRole(
        @Param('id') id: string,
        @Body() user: UserDto
    ): Observable<UpdateResult> {
        return this.userService.updateRole(id, user);
    }

    @Delete(':id')
    public delete(@Param('id') id: string): Observable<any> {
        return this.userService.deleteAccount(id);
    }
}
