import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { HashService } from './hash.service';

@Injectable()
export class UserService {

	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		private hashService: HashService
	) {}

	async register(createUserDto: CreateUserDto) {
		const { email } = createUserDto;
		const createUser = new this.userModel(createUserDto);
		const user = await this.getUserByEmail(email);
		if (user) {
			throw new BadRequestException();
		}

		createUser.password = await this.hashService.hashPassword(createUser.password);
		return createUser.save();
	}

	async getAllUsers() {
		return await this.userModel.find({}, { _id: 0, __v: 0, password: 0, sessionToken: 0 }).exec();
	}

	async getUserByEmail(email: string) {
		const user = await this.userModel.findOne({ email }).exec();
		return user;
	}

	async getUserById(id: string) {
		const user = await this.userModel.findById(id, { _id: 0, __v: 0 }).exec();
		if (user) {
			return user;
		}
		throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
	}

	async update(email: string, updateUserDto: UpdateUserDto) {
		if (updateUserDto.password) {
			updateUserDto.password = await this.hashService.hashPassword(updateUserDto.password);
			return { msg: 'Password Update' };
		}
		if (updateUserDto.email) {
			const user = this.getUserByEmail(updateUserDto.email);
			if (user) {
				throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
			} 
		}
		await this.userModel.findOneAndUpdate({ email: email }, { ...updateUserDto }).exec();
	}

	async remove(id: string) {
		const userExist = this.getUserById(id);
		if (userExist) {
			await this.userModel.findOneAndDelete({ _id: id }).exec();
		}
	}
}
