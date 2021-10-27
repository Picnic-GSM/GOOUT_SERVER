import { HttpException, HttpStatus, Injectable, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Student } from 'src/user/entites/student.entity';
import { Teacher } from 'src/user/entites/teacher.entity';
import { RedisService } from 'src/util/redis';
@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly redisService: RedisService,
    ) {}

    // 학생용 accessToken 발급
    issueToken(studentObj: Student) {
        const payload = {
            iss: 'GooutAPIServer',
            sub: studentObj.idx,
            email: studentObj.email,
        };
        return this.jwtService.sign(payload);
    }

    // 선생님용 accessToken 발급
    issueTokenForTeacher(teacherObj: Teacher) {
        const payload = {
            iss: 'GooutAPIServer',
            sub: teacherObj.idx,
            grade: teacherObj.grade,
            class: teacherObj.class,
        };
        return this.jwtService.sign(payload);
    }

    // accessToken validator
    validator(token: string) {
        const splitedToken = token.split(' ');
        try {
            if (splitedToken[0] == 'jwt') {
                const info = this.jwtService.verify(splitedToken[1]);
                if (this.redisService.getData(info.sub)) {
                    return info;
                }
            } else {
                // 나중에 Bearer 혹은 OAuth 추가할 때의 코드 작성
                throw new HttpException(
                    'Invalid token input',
                    HttpStatus.UNAUTHORIZED,
                );
            }
        } catch (error) {
            console.log(error);
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
    }
}
