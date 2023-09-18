import { IsEmail, IsLowercase, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTransactionDto {
	@IsNumber()
	nature: number; //1. Deposito, 2. Retiro

	@IsOptional()
	@IsString()
	txHash: string;

	@IsNumber()
	amount: number;

	@IsString()
	to: string;

	@IsOptional()
	@IsNumber()
	status: number; //1. Aprobando, 2. Procesando, 3. Procesado, 4. Cancelado
}
