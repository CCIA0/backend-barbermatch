import { Controller, Get, Param, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me/:id')
  async getMe(@Param('id') id: number) {
    return this.usersService.findMe(id);
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Put('profile/:id')
  async updateProfile(
    @Param('id') id: number,
    @Body(new ValidationPipe()) body: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(id, body);
  }
}
