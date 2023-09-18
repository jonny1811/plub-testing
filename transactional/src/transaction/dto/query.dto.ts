import { Transform } from 'class-transformer';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class QueryDto {
	@IsOptional()
	@IsString()
	nature: string;

	@IsOptional()
	@IsString()
	txHash: string;

	@IsOptional()
	@IsString()
	@IsMongoId()
	transactionId: string;

	@IsOptional()
	@IsString()
	email: string;
}
