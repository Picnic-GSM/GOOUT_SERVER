import { HttpException, HttpStatus, Injectable, Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Student } from "src/user/entites/student.entity";
import { Teacher } from "src/user/entites/teacher.entity";
import { StudentDataService, TeacherDataService } from "src/user/user.service";
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private studentDataService: StudentDataService,
    private teacherDataService: TeacherDataService
  ) {}

  // 학생용 accessToken 발급
  async issueToken(studentObj: Student) {
    const payload = {
      iss: "GooutAPIServer",
      email: studentObj.email,
      sub: studentObj.id,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  // 선생님용 accessToken 발급
  async issueTokenForTeacher(teacherObj: Teacher) {
    const payload = {
      iss: "GooutAPIServer",
      grade: teacherObj.grade,
      class: teacherObj.class,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  // 학생 email, password validator
  async validateStudent(email: string, password: string): Promise<any> {
    const studentObj = await this.studentDataService.findOneWithEmail(email);
    if (studentObj && studentObj.password === password) {
      const { password, ...result } = studentObj;
      return result;
    }
    return null;
  }

  // accessToken validator
  async validator(token: any) {
    try {
      return await this.jwtService.verify(token);
    } catch (error) {
      throw new HttpException("token is expired", HttpStatus.UNAUTHORIZED);
    }
  }
}
