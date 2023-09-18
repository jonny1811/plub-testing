import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';


@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) { }

	public async getAuthenticatedUser(email: string, plainTextPassword: string) {
		try {
			const user = await this.userService.getUserByEmail(email);
			await this.verifyPassword(plainTextPassword, user.password)
			user.password = undefined;
			return user;
		} catch (error) {
			throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
		}
	}

	private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
		const isPasswordMatching = await bcrypt.compare(
			plainTextPassword,
			hashedPassword
		);
		if (!isPasswordMatching) {
			throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
		}
	}

	public async getCookieWithJwtToken(userId: string, email: string) {
		const payload: TokenPayload = { userId };
		const token = this.jwtService.sign(payload);
		await this.userService.update(email, { sessionToken: token });
		return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
	}

	public getCookieForLogOut() {
		return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
	}
}
