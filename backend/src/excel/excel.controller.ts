import { Controller, Post, Get, UseInterceptors, UploadedFile, Res, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './excel.service';
import type { Response } from 'express';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('import/customers')
  @UseInterceptors(FileInterceptor('file'))
  async importCustomers(@UploadedFile() file: Express.Multer.File, @Body('sourceId') sourceId: string) {
    return this.excelService.importCustomers(file, Number(sourceId));
  }

  @Get('export/customers')
  async exportCustomers(@Res() res: Response) {
    const buffer = await this.excelService.exportCustomers();
    
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=customers.xlsx',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
