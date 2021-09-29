import { HttpException, HttpStatus, Injectable, Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Student } from "src/user/entites/student.entity";
import { Teacher } from "src/user/entites/teacher.entity";
import { StudentDataService, TeacherDataService } from "src/user/user.service";
import { hashSha512 } from "src/util/hash";
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // 학생용 accessToken 발급
  issueToken(studentObj: Student) {
    const payload = {
      iss: "GooutAPIServer",
      email: studentObj.email,
      sub: studentObj.idx,
    };
    return this.jwtService.sign(payload);
  }

  // 선생님용 accessToken 발급
  issueTokenForTeacher(teacherObj: Teacher) {
    const payload = {
      iss: "GooutAPIServer",
      grade: teacherObj.grade,
      class: teacherObj.class,
    };
    return this.jwtService.sign(payload);
  }

  // accessToken validator
  validator(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new HttpException("token is expired", HttpStatus.UNAUTHORIZED);
    }
  }
}
