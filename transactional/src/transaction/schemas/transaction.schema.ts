import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
	@Prop({
		required: true,
		index: true
	})
	nature: number; //1. Deposito, 2. Retiro

	@Prop({
		required: false,
		index: true
	})
	txHash: string;

	@Prop()
	amount: number;

	@Prop()
	to: string;

	@Prop({
		required: false,
		index: true,
		default: 1
	})
	status: number; //1. Aprobando, 2. Processando, 3. Procesado, 4. Cancelado
}


export const TransactionSchema = SchemaFactory.createForClass(Transaction);