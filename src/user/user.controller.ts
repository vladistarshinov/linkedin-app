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
    public findAll(): Observable<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    public findOne(@Param() params: any): Observable<Omit<User, 'password'>> {
        return this.userService.findOne(params.id);
    }

    @Put(':id')
    public update(
        @Param('id') id: string,
        @Body() user: UserDto
    ): Observable<any> {
        return this.userService.updateOne(id, user);
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
        return this.userService.deleteOne(id);
    }
}
