/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { UpdateProfileDto } from './update-profile.dto';
import { CreateAppointmentDto } from './create-appointment.dto';
import { CreateHairstyleDto } from './create-hairstyle.dto';

describe('DTOs', () => {
  describe('CreateUserDto', () => {
    it('should validate a valid user DTO', async () => {
      const dto = new CreateUserDto();
      dto.email = 'test@example.com';
      dto.password = 'password123';
      dto.role = 'client';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail on invalid email', async () => {
      const dto = new CreateUserDto();
      dto.email = 'invalid-email';
      dto.password = 'password123';
      dto.role = 'client';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('should fail on invalid role', async () => {
      const dto = new CreateUserDto();
      dto.email = 'test@example.com';
      dto.password = 'password123';
      dto.role = 'invalid' as any;

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isEnum');
    });
  });

  describe('UpdateProfileDto', () => {
    it('should validate a valid profile update DTO', async () => {
      const dto = new UpdateProfileDto();
      dto.name = 'John Doe';
      dto.stylePreferences = 'casual';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should allow optional fields', async () => {
      const dto = new UpdateProfileDto();
      dto.name = 'John Doe';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('CreateAppointmentDto', () => {
    it('should validate a valid appointment DTO', async () => {
      const dto = plainToClass(CreateAppointmentDto, {
        date: '2025-09-10T10:00:00.000Z',
        status: 'pending',
        userId: 1,
        barberId: 1,
        barbershopId: 1,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail on invalid date format', async () => {
      const dto = plainToClass(CreateAppointmentDto, {
        date: 'invalid-date',
        status: 'pending',
        userId: 1,
        barberId: 1,
        barbershopId: 1,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isDateString');
    });
  });

  describe('CreateHairstyleDto', () => {
    it('should validate a valid hairstyle DTO', async () => {
      const dto = new CreateHairstyleDto();
      dto.name = 'Classic Cut';
      dto.description = 'A timeless style';
      dto.imageUrl = 'http://example.com/image.jpg';
      dto.recommendedFaceShapes = ['oval', 'round'];

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail on missing required field', async () => {
      const dto = plainToClass(CreateHairstyleDto, {
        description: 'A timeless style',
        imageUrl: 'https://example.com/image.jpg',
        recommendedFaceShapes: ['oval', 'round'],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });

    it('should fail on invalid URL format', async () => {
      const dto = plainToClass(CreateHairstyleDto, {
        name: 'Classic Cut',
        description: 'A timeless style',
        imageUrl: 'not-a-url',
        recommendedFaceShapes: ['oval', 'round'],
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isUrl');
    });
  });
});
