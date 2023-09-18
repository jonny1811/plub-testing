import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { QueryDto } from './dto/query.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-auth.guard';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post('create')
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('all')
  findAll(@Request() req, @Query() queryDto: QueryDto) {
    return this.transactionService.getTransactions(
		queryDto.email,
		queryDto
	);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('info')
  findOne(@Query() queryDto: QueryDto) {
    return this.transactionService.getTransaction(queryDto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(id, updateTransactionDto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch("batch/:email")
  updateBatch(@Param("email") email: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.bulkUpdate(email, updateTransactionDto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(id);
  }
}
