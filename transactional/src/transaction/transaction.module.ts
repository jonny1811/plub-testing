import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { UserModule } from '../user/user.module';

@Module({
	imports: [
		UserModule,
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Transaction.name, schema: TransactionSchema }
		])
	],
	controllers: [TransactionController],
	providers: [TransactionService],
})
export class TransactionModule { }
