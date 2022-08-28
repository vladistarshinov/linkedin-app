import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {JwtAuthService} from "../jwt-auth/jwt-auth.service";
import {User as UserEntity} from '../../../user/user.entity';
import {catchError, from, map, Observable, switchMap, throwError} from "rxjs";
import {User} from "../../../user/interfaces/user.interface";
import {UserDto} from "../../../user/dto/user.dto";
import {UserRole} from "../../../user/interfaces/role.interface";

@Injectable()
export class UserAuthService {
    constructor(
        private jwtAuthService: JwtAuthService,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    ) {}

    public validateUser(email: string, password: string): Observable<User> {
        return this.findByMail(email)
            .pipe(
                switchMap((user: User) =>
                    this.jwtAuthService.comparePasswords(password, user.password)
                )
            )
    }

    public login(user: UserDto): Observable<Object> {
        return this.validateUser(user.email, user.password)
            .pipe(
                switchMap((validUser: Omit<User, 'password'>) => {
                    if (validUser) {
                        return this.jwtAuthService.generateToken(user)
                            .pipe(
                                map((jwt: string) => jwt)
                            )
                    } else {
                        throw new BadRequestException('Неверные логин или пароль!')
                    }
                })
            )
    }

    public create(user: UserDto): Observable<Omit<User, 'password'> | Object> {
        return from(this.userRepository.findOneBy({email: user.email}))
            .pipe(
                switchMap((existUser: User) => {
                    if (existUser) throw new BadRequestException('Такой пользователь уже существует!')
                    else {
                        return this.jwtAuthService.hashPassword(user.password)
                            .pipe(
                                switchMap((passwordHash: string) => {
                                    const newUser = new UserEntity();

                                    newUser.name = user.name;
                                    newUser.username = user.username;
                                    newUser.email = user.email;
                                    newUser.password = passwordHash;
                                    newUser.role = UserRole.USER;

                                    return from(this.userRepository.save(newUser))
                                        .pipe(
                                            map((user: User) => {
                                                const {password, ...result} = user;
                                                return result;
                                            }),
                                            catchError(error => throwError(error.message))
                                        )
                                })
                            )
                    }
                })
            )
    }

    public findByMail(email: string): Observable<User> {
        return from(this.userRepository.findOneBy({email}))
            .pipe(
                map((user: User) => {
                    if (user) return user;
                    else throw new NotFoundException('Пользователь с такой почтой не найден!');
                })
            )
    }
}
