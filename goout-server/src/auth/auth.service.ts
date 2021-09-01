import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
	){}

	async IssueJWT(user: any) {
        console.log(user)
		const payload = { userid: user.userid, sub: user.email };
        console.log(this.jwtService.sign(payload))
		return { access_token: this.jwtService.sign(payload) };
	}
}