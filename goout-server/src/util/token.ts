import { HttpException, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

export class AuthModule {
  constructor(private jwtService: JwtService) {}

  async issueToken(user: any) {
    const payload = { userid: user.userid, aud: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async issueTokenForTeacher(grade: number, class_n: number) {
    const payload = { grade: grade, class: class_n };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validator(token: string) {
    try {
      let decoded_token = await this.jwtService.verify(token);
    } catch (error) {
      throw new HttpException("token is expired", HttpStatus.UNAUTHORIZED);
    }
  }
}
