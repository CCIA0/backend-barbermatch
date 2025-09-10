import { Controller, Get, Param, Put, Body, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me/:id')
  async getMe(@Param('id') id: number) {
    const user = await this.usersService.findMe(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Put('profile/:id')
  async updateProfile(
    @Param('id') id: number,
    @Body(new ValidationPipe()) body: UpdateProfileDto,
  ) {
    const profile = await this.usersService.updateProfile(id, body);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }
}
