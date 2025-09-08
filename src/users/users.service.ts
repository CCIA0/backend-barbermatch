import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserProfile } from '../entities/user-profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private profilesRepository: Repository<UserProfile>,
  ) {}

  async findMe(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }

  async updateProfile(
    id: number,
    data: Partial<UserProfile>,
  ): Promise<UserProfile | null> {
    const profile = await this.profilesRepository.findOne({
      where: { user: { id } },
    });
    if (profile) {
      Object.assign(profile, data);
      return this.profilesRepository.save(profile);
    }
    return null;
  }
}
