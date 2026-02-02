import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, SalaryStatus, LessonStatus } from '@prisma/client';
import { CreateSalaryRecordDto, ProcessSalaryDto } from './dto/create-salary-record.dto';

@Injectable()
export class SalariesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all salary records
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    teacherId?: string;
    status?: SalaryStatus;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    const { skip = 0, take = 50, teacherId, status, dateFrom, dateTo } = params || {};

    const where: Prisma.SalaryRecordWhereInput = {};

    if (teacherId) where.teacherId = teacherId;
    if (status) where.status = status;
    if (dateFrom || dateTo) {
      where.month = {
        ...(dateFrom && { gte: dateFrom }),
        ...(dateTo && { lte: dateTo }),
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.salaryRecord.findMany({
        where,
        skip,
        take,
        orderBy: { month: 'desc' },
        include: {
          teacher: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.salaryRecord.count({ where }),
    ]);

    return {
      items,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
      totalPages: Math.ceil(total / take),
    };
  }

  /**
   * Get salary record by ID
   */
  async findById(id: string) {
    const record = await this.prisma.salaryRecord.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!record) {
      throw new NotFoundException(`Salary record with ID ${id} not found`);
    }

    return record;
  }

  /**
   * Create a salary record manually
   */
  async create(dto: CreateSalaryRecordDto) {
    // Validate teacher
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: dto.teacherId },
    });

    if (!teacher) {
      throw new BadRequestException(`Teacher with ID ${dto.teacherId} not found`);
    }

    const totalDeductions = dto.totalDeductions || 0;
    const netAmount = dto.grossAmount - totalDeductions;

    return this.prisma.salaryRecord.create({
      data: {
        teacherId: dto.teacherId,
        month: new Date(dto.month),
        lessonsCount: dto.lessonsCount,
        grossAmount: dto.grossAmount,
        totalDeductions,
        netAmount: Math.max(0, netAmount),
        status: SalaryStatus.PENDING,
        notes: dto.notes,
      },
      include: {
        teacher: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true },
            },
          },
        },
      },
    });
  }

  /**
   * Generate salary record for a teacher for a month
   */
  async generateSalaryRecord(teacherId: string, month: Date) {
    // Get teacher with hourly rate
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    if (!teacher) {
      throw new BadRequestException(`Teacher with ID ${teacherId} not found`);
    }

    // Get start and end of month
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59);

    // Count completed lessons in period
    const lessons = await this.prisma.lesson.findMany({
      where: {
        teacherId,
        status: LessonStatus.COMPLETED,
        completedAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      select: { duration: true },
    });

    const lessonsCount = lessons.length;
    const totalHours = lessons.reduce((sum, l) => sum + l.duration / 60, 0);
    const grossAmount = totalHours * Number(teacher.hourlyRate);

    // Get deductions for this period
    const deductions = await this.prisma.deduction.aggregate({
      where: {
        teacherId,
        appliedAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: { amount: true },
    });

    const totalDeductions = Number(deductions._sum.amount) || 0;
    const netAmount = grossAmount - totalDeductions;

    // Check if record already exists for this month
    const existing = await this.prisma.salaryRecord.findFirst({
      where: {
        teacherId,
        month: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Salary record already exists for this month');
    }

    return this.prisma.salaryRecord.create({
      data: {
        teacherId,
        month: startOfMonth,
        lessonsCount,
        grossAmount,
        totalDeductions,
        netAmount: Math.max(0, netAmount),
        status: SalaryStatus.PENDING,
      },
      include: {
        teacher: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true },
            },
          },
        },
      },
    });
  }

  /**
   * Process salary payment
   */
  async processSalary(id: string, dto: ProcessSalaryDto) {
    const record = await this.findById(id);

    if (record.status === SalaryStatus.PAID) {
      throw new BadRequestException('Salary is already paid');
    }

    return this.prisma.salaryRecord.update({
      where: { id },
      data: {
        status: SalaryStatus.PAID,
        paidAt: new Date(),
        notes: dto.notes || record.notes,
      },
      include: {
        teacher: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true },
            },
          },
        },
      },
    });
  }

  /**
   * Get teacher salary summary
   */
  async getTeacherSalarySummary(teacherId: string) {
    const [total, paid, pending] = await Promise.all([
      this.prisma.salaryRecord.aggregate({
        where: { teacherId },
        _sum: { netAmount: true },
        _count: true,
      }),
      this.prisma.salaryRecord.aggregate({
        where: { teacherId, status: SalaryStatus.PAID },
        _sum: { netAmount: true },
        _count: true,
      }),
      this.prisma.salaryRecord.aggregate({
        where: { teacherId, status: SalaryStatus.PENDING },
        _sum: { netAmount: true },
        _count: true,
      }),
    ]);

    // Get total deductions
    const deductions = await this.prisma.deduction.aggregate({
      where: { teacherId },
      _sum: { amount: true },
      _count: true,
    });

    return {
      total: {
        count: total._count,
        amount: Number(total._sum.netAmount) || 0,
      },
      paid: {
        count: paid._count,
        amount: Number(paid._sum.netAmount) || 0,
      },
      pending: {
        count: pending._count,
        amount: Number(pending._sum.netAmount) || 0,
      },
      deductions: {
        count: deductions._count,
        amount: Number(deductions._sum.amount) || 0,
      },
    };
  }

  /**
   * Generate monthly salary records for all teachers
   */
  async generateMonthlySalaries(year: number, month: number) {
    const targetMonth = new Date(year, month - 1, 1);

    // Get all active teachers
    const teachers = await this.prisma.teacher.findMany({
      where: {
        user: { status: 'ACTIVE' },
      },
    });

    const records = [];
    const errors = [];

    for (const teacher of teachers) {
      try {
        const record = await this.generateSalaryRecord(teacher.id, targetMonth);
        records.push(record);
      } catch (error) {
        errors.push({
          teacherId: teacher.id,
          error: (error as Error).message,
        });
      }
    }

    return {
      generated: records.length,
      errors: errors.length,
      records,
      errorDetails: errors,
    };
  }
}
