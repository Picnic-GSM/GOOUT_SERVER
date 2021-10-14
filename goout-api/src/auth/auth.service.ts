import { HttpException, HttpStatus, Injectable, Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Student } from "src/user/entites/student.entity";
import { Teacher } from "src/user/entites/teacher.entity";
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
    const splitedToken = token.split(" ");
    try {
      if (splitedToken[0] == "jwt") {
        return this.jwtService.verify(splitedToken[1]);
      } else {
        // 나중에 Bearer 혹은 OAuth 추가할 때의 코드 작성
        throw new HttpException("Invalid token input", HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      console.error(error);
      throw new HttpException("token is expired", HttpStatus.UNAUTHORIZED);
    }
  }
}
