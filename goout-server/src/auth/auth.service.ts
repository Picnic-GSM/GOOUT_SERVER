import { HttpException, HttpStatus, Injectable, Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "10m" },
    }),
  ],
})
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async issueToken(user: any) {
    const payload = { userid: user.userid, sub: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async issueTokenForTeacher(TeacherGrade: number, TeacherClass: number) {
    const payload = { grade: TeacherGrade, class: TeacherClass };
    return { access_token: this.jwtService.sign(payload) };
  }
  async validator(token: any) {
    try {
      return await this.jwtService.verify(token);
    } catch (error) {
      throw new HttpException("token is expired", HttpStatus.UNAUTHORIZED);
    }
  }
}
