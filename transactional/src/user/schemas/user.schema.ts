import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { Transaction } from "../../transaction/schemas/transaction.schema";

export type UserDocument = User & Document;

@Schema()
export class User {
	@Prop()
	firstName: string;

	@Prop()
	lastName: string;

	@Prop({
		required: true,
		unique: true
	})
	email: string;

	@Prop({
		required: true
	})
	password: string;

	@Prop({ type: [{ type: Types.ObjectId, ref: 'Transaction' }] })
	transactions: [Transaction]

	@Prop()
	sessionToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ sessionToken: 1 }, { expireAfterSeconds: 900 })
