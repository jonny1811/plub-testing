import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class TransactionService {

	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@InjectModel(Transaction.name)
		private transactionModel: Model<TransactionDocument>,
	) { }

	async create(createTransactionDto: CreateTransactionDto) {
		let data = await this.userModel.
			aggregate([
				{ $match: { email: createTransactionDto.to } },
				{ $unwind: '$transactions' },
				{ $project: { _id: 0 } },
				{
					$lookup: {
						from: 'transactions',
						localField: 'transactions',
						foreignField: '_id',
						as: 'transactionsData',
						pipeline: [
							{
								$match: {
									txHash: createTransactionDto.txHash,
									to: createTransactionDto.to
								}
							}
						]
					}
				}
			])
			.exec()

		let exists = true;
		if (!data || data.length === 0) exists = false;

		let transaction = exists
			? data.find((t) => t.transactionsData.length > 0)
			: undefined;

		if (transaction) {
			transaction = transaction.transactionsData[0];
			return {
				txHash: transaction.txHash,
				amount: transaction.amount,
				to: transaction.to,
				status: transaction.status,
			};
		} else {
			const transaction = new this.transactionModel({
				nature: createTransactionDto.nature,
				txHash: createTransactionDto.txHash + createTransactionDto.to,
				amount: createTransactionDto.amount,
				to: createTransactionDto.to,
				status: createTransactionDto.status,
			});

			const saved = await transaction.save();
			if (saved) {
				const result = await this.userModel.updateOne(
					{
						email: createTransactionDto.to,
					},
					{
						$push: { transactions: transaction },
					},
				);
				if (result) {
					return {
						nature: transaction.nature,
						txHash: transaction.txHash,
						amount: transaction.amount,
						to: transaction.to,
						status: transaction.status,
					};
				}
			}
		}

	}

	async getTransactions(email: string, queryDto: QueryDto) {
		const data = await this.userModel
			.aggregate([
				{ $match: { email } },
				{ $unwind: '$transactions' },
				{ $project: { _id: 0, __v: 0, password: 0, sessionToken: 0 } },
				{
					$lookup: {
						from: 'transactions',
						localField: 'transactions',
						foreignField: '_id',
						as: 'transactionsData',
						pipeline: [
							{
								$project: { _id: 0, __v: 0 }
							},
							{
								$match: { nature: parseInt(queryDto.nature) }
							}
						]
					}
				}
			])
			.exec()

		if (data && data.length > 0) {
			let transactions = data.filter(t => t.transactionsData.length > 0)
			if (transactions) {
				return transactions;
			}
		}
	}

	async getTransaction(queryDto: QueryDto) {
		const data = await this.transactionModel
			.findOne(
				{ _id: new Types.ObjectId(queryDto.transactionId) },
				{ _id: 0, __v: 0 }
			)
			.exec()
		if (data) {
			return data;
		} else {
			throw new NotFoundException('Transaction not found')
		}
	}

	async update(id: string, updateTransactionDto: UpdateTransactionDto) {
		await this.transactionModel
			.findOneAndUpdate({ _id: id }, { ...updateTransactionDto })
			.exec();
	}

	async bulkUpdate(email: string, updateTransactionDto: UpdateTransactionDto) {
		try {
			await this.transactionModel.bulkWrite([
				{
					updateMany: {
						filter: { 'to': email },
						update: { 'status': updateTransactionDto.status, 'amount': updateTransactionDto.amount },
						upsert: true
					}
				}
			]);
			return { msg: 'All Transaction is updated' };
		} catch (error) {
			throw new HttpException('Error updating transactions', HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
	}

	async remove(id: string) {
		await this.transactionModel
			.findOneAndDelete({ _id: id })
			.exec();
	}
}
