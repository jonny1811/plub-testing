import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocalAuthenticationGuard } from '../auth/local-auth.guard';
import RequestWithUser from '../auth/interfaces/requestWithUser.interface';
import { AuthService } from '../auth/auth.service';
import { Response } from 'express';
import JwtAuthenticationGuard from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService
	) { }

	@Post('register')
	registerUser(@Body() createUserDto: CreateUserDto) {
		return this.userService.register(createUserDto);
	}

	@UseGuards(LocalAuthenticationGuard)
	@Post('login')
	async loginUser(@Req() request: RequestWithUser, @Res() response: Response) {
		const user = request.user;
		const cookie = await this.authService.getCookieWithJwtToken(user.id, user.email);
		response.setHeader('Set-Cookie', cookie);
		return response.send({ msg: 'Logged In!' });
	}

	@UseGuards(JwtAuthenticationGuard)
	@Post('logout')
	async logout(@Req() request: RequestWithUser, @Res() response: Response) {
		response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
		return response.sendStatus(200);
	}

	@UseGuards(JwtAuthenticationGuard)
	@Get('info')
	findOne(@Req() request: RequestWithUser) {
		const user = request.user;
		user.password = undefined;
		user.sessionToken = undefined;
		return user;
	}

	@UseGuards(JwtAuthenticationGuard)
	@Get('all')
	findAll() {
		return this.userService.getAllUsers();
	}

	@UseGuards(JwtAuthenticationGuard)
	@Patch(':email')
	update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(email, updateUserDto);
	}

	@UseGuards(JwtAuthenticationGuard)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(id);
	}
}
