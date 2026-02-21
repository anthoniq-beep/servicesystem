import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LeadSourceType } from '@prisma/client';

export class CreateChannelDto {
  name: string;
  type: LeadSourceType;
  points?: number;
  cost?: number;
}

export class UpdateChannelDto {
  name?: string;
  type?: LeadSourceType;
  points?: number;
  cost?: number;
  isActive?: boolean;
}

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  create(createChannelDto: CreateChannelDto) {
    return this.prisma.leadSource.create({
      data: {
        name: createChannelDto.name,
        type: createChannelDto.type,
        points: createChannelDto.points || 0,
        cost: createChannelDto.cost || 0,
      },
    });
  }

  findAll() {
    return this.prisma.leadSource.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.leadSource.findUnique({
      where: { id },
    });
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return this.prisma.leadSource.update({
      where: { id },
      data: updateChannelDto,
    });
  }

  remove(id: number) {
    return this.prisma.leadSource.delete({
      where: { id },
    });
  }
}
