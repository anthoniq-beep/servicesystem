import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('team')
  getTeamStats(@Request() req, @Query('month') month?: string) {
    return this.statsService.getTeamStats(req.user.userId, month);
  }
}
