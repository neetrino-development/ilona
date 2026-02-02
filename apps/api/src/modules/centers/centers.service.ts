import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCenterDto, UpdateCenterDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CentersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
    isActive?: boolean;
  }) {
    const { skip = 0, take = 50, search, isActive } = params || {};

    const where: Prisma.CenterWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [items, total] = await Promise.all([
      this.prisma.center.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { groups: true },
          },
        },
      }),
      this.prisma.center.count({ where }),
    ]);

    return {
      items,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async findById(id: string) {
    const center = await this.prisma.center.findUnique({
      where: { id },
      include: {
        groups: {
          include: {
            teacher: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            _count: {
              select: { students: true, lessons: true },
            },
          },
        },
        _count: {
          select: { groups: true },
        },
      },
    });

    if (!center) {
      throw new NotFoundException(`Center with ID ${id} not found`);
    }

    return center;
  }

  async create(dto: CreateCenterDto) {
    return this.prisma.center.create({
      data: {
        name: dto.name,
        address: dto.address,
        phone: dto.phone,
        email: dto.email,
        description: dto.description,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateCenterDto) {
    await this.findById(id); // Check if exists

    return this.prisma.center.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findById(id); // Check if exists

    return this.prisma.center.delete({
      where: { id },
    });
  }

  async toggleActive(id: string) {
    const center = await this.findById(id);

    return this.prisma.center.update({
      where: { id },
      data: { isActive: !center.isActive },
    });
  }

  async getStatistics(id: string) {
    await this.findById(id);

    const [groupsCount, studentsCount, lessonsCount] = await Promise.all([
      this.prisma.group.count({ where: { centerId: id } }),
      this.prisma.student.count({
        where: { group: { centerId: id } },
      }),
      this.prisma.lesson.count({
        where: { group: { centerId: id } },
      }),
    ]);

    return {
      groupsCount,
      studentsCount,
      lessonsCount,
    };
  }
}

