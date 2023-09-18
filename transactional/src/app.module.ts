import { Module } from '@nestjs/common';
import * as Joi from '@hapi/joi';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: Joi.object({
				JWT_SECRET: Joi.string().required(),
				JWT_EXPIRATION_TIME: Joi.string().required(),
			})
		}),
		MongooseModule.forRoot(
			process.env.DB_URI
		),
		UserModule,
		TransactionModule,
		AuthModule
	],
	providers: [],
})
export class AppModule { }
