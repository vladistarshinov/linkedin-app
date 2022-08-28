import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, UpdateResult} from "typeorm";
import {User as UserEntity} from './user.entity';
import {User} from "./interfaces/user.interface";
import {from, map, Observable} from "rxjs";
import {UserDto} from "./dto/user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    public getAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach((v: User) => delete v.password)
                return users;
            })
        )
    }

    public findById(id: string): Observable<Omit<User, 'password'>> {
        return from(this.userRepository.findOneBy({id})).pipe(
            map((user: User) => {
                const {password, ...result} = user;
                return result;
            })
        )
    }

    public updateUserData(id: string, user: UserDto): Observable<any> {
        delete user.email;
        delete user.password;
        return from(this.userRepository.update(id, user));
    }

    public updateRole(id: string, user: UserDto): Observable<UpdateResult> {
        return from(this.userRepository.update(id, user));
    }

    public deleteAccount(id: string): Observable<any> {
        return from(this.userRepository.delete(id));
    }

}
