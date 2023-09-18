import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { HashService } from './hash.service';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [
		MongooseModule.forFeature([{
			name: User.name,
			schema: UserSchema
		}]),
		forwardRef(() => AuthModule)
	],
	controllers: [UserController],
	providers: [UserService, HashService],
	exports: [UserService]
})
export class UserModule { }
