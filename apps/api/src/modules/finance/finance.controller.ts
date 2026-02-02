import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { PaymentsService } from './payments.service';
import { SalariesService } from './salaries.service';
import { DeductionsService } from './deductions.service';
import { Roles } from '../../common/decorators';
import { UserRole, PaymentStatus, SalaryStatus, DeductionReason } from '@prisma/client';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  QueryPaymentDto,
  ProcessPaymentDto,
} from './dto/create-payment.dto';
import { CreateDeductionDto } from './dto/create-deduction.dto';
import { CreateSalaryRecordDto, ProcessSalaryDto } from './dto/create-salary-record.dto';

@Controller('finance')
@Roles(UserRole.ADMIN)
export class FinanceController {
  constructor(
    private readonly financeService: FinanceService,
    private readonly paymentsService: PaymentsService,
    private readonly salariesService: SalariesService,
    private readonly deductionsService: DeductionsService,
  ) {}

  // ============ DASHBOARD ============

  @Get('dashboard')
  async getDashboard(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.financeService.getDashboard(
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined,
    );
  }

  @Get('report/monthly')
  async getMonthlyReport(
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.financeService.getMonthlyReport(
      parseInt(year, 10),
      parseInt(month, 10),
    );
  }

  @Post('automation/run')
  async runAutomatedTasks() {
    return this.financeService.runAutomatedTasks();
  }

  // ============ PAYMENTS ============

  @Get('payments')
  async getPayments(@Query() query: QueryPaymentDto) {
    return this.paymentsService.findAll({
      skip: query.skip,
      take: query.take,
      studentId: query.studentId,
      status: query.status as PaymentStatus | undefined,
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
    });
  }

  @Get('payments/:id')
  async getPayment(@Param('id') id: string) {
    return this.paymentsService.findById(id);
  }

  @Post('payments')
  async createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Put('payments/:id')
  async updatePayment(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.paymentsService.update(id, dto);
  }

  @Patch('payments/:id/process')
  async processPayment(@Param('id') id: string, @Body() dto: ProcessPaymentDto) {
    return this.paymentsService.processPayment(id, dto);
  }

  @Patch('payments/:id/cancel')
  async cancelPayment(@Param('id') id: string) {
    return this.paymentsService.cancel(id);
  }

  @Get('payments/student/:studentId/summary')
  async getStudentPaymentSummary(@Param('studentId') studentId: string) {
    return this.paymentsService.getStudentPaymentSummary(studentId);
  }

  @Get('payments/stats/revenue')
  async getRevenueStats(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.paymentsService.getRevenueStats(
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined,
    );
  }

  // ============ SALARIES ============

  @Get('salaries')
  async getSalaries(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('teacherId') teacherId?: string,
    @Query('status') status?: string,
  ) {
    return this.salariesService.findAll({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      teacherId,
      status: status as SalaryStatus | undefined,
    });
  }

  @Get('salaries/:id')
  async getSalary(@Param('id') id: string) {
    return this.salariesService.findById(id);
  }

  @Post('salaries')
  async createSalary(@Body() dto: CreateSalaryRecordDto) {
    return this.salariesService.create(dto);
  }

  @Post('salaries/generate')
  async generateSalary(
    @Body('teacherId') teacherId: string,
    @Body('month') month: string,
  ) {
    return this.salariesService.generateSalaryRecord(teacherId, new Date(month));
  }

  @Post('salaries/generate-monthly')
  async generateMonthlySalaries(
    @Body('year') year: number,
    @Body('month') month: number,
  ) {
    return this.salariesService.generateMonthlySalaries(year, month);
  }

  @Patch('salaries/:id/process')
  async processSalary(@Param('id') id: string, @Body() dto: ProcessSalaryDto) {
    return this.salariesService.processSalary(id, dto);
  }

  @Get('salaries/teacher/:teacherId/summary')
  async getTeacherSalarySummary(@Param('teacherId') teacherId: string) {
    return this.salariesService.getTeacherSalarySummary(teacherId);
  }

  // ============ DEDUCTIONS ============

  @Get('deductions')
  async getDeductions(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('teacherId') teacherId?: string,
    @Query('reason') reason?: string,
  ) {
    return this.deductionsService.findAll({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      teacherId,
      reason: reason as DeductionReason | undefined,
    });
  }

  @Get('deductions/:id')
  async getDeduction(@Param('id') id: string) {
    return this.deductionsService.findById(id);
  }

  @Post('deductions')
  async createDeduction(@Body() dto: CreateDeductionDto) {
    return this.deductionsService.create(dto);
  }

  @Delete('deductions/:id')
  async deleteDeduction(@Param('id') id: string) {
    return this.deductionsService.delete(id);
  }

  @Get('deductions/stats')
  async getDeductionStats(
    @Query('teacherId') teacherId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.deductionsService.getStatistics(
      teacherId,
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined,
    );
  }
}
