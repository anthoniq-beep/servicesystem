import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as xlsx from 'xlsx';

@Injectable()
export class ExcelService {
  constructor(private prisma: PrismaService) {}

  async importCustomers(file: Express.Multer.File, sourceId: number) {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const results: {
      success: number;
      failed: number;
      errors: { row: any; error: string }[];
    } = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const row of data) {
      try {
        const { 姓名, 电话, 公司名称 } = row as any;
        if (!姓名 || !电话) {
          throw new Error('姓名和电话为必填项');
        }

        await this.prisma.customer.create({
          data: {
            name: 姓名,
            phone: String(电话),
            companyName: 公司名称,
            sourceId,
            status: 'LEAD',
          },
        });
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({ row, error: error.message });
      }
    }

    return results;
  }

  async exportCustomers() {
    const customers = await this.prisma.customer.findMany({
      include: {
        source: true,
        owner: true,
      },
    });

    const data = customers.map(c => ({
      ID: c.id,
      姓名: c.name,
      电话: c.phone,
      公司名称: c.companyName || '',
      状态: c.status,
      来源: c.source?.name || '未知',
      负责人: c.owner?.name || '公海池',
      创建时间: c.createdAt,
    }));

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Customers');

    return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
}
