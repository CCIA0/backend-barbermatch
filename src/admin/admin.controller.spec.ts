import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { UsersService } from '../users/users.service';
import { BarbershopsService } from '../barbershops/barbershops.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { User } from '../entities/user.entity';
import { Barbershop } from '../entities/barbershop.entity';
import { Appointment } from '../entities/appointment.entity';
import { UserRole } from '../auth/interfaces/auth.interface';

describe('AdminController', () => {
  let controller: AdminController;

  const mockUsersService = {
    findAll: jest.fn(),
    delete: jest.fn(),
  };

  const mockBarbershopsService = {
    getBarbershops: jest.fn(),
    deleteBarbershop: jest.fn(),
  };

  const mockAppointmentsService = {
    findAll: jest.fn(),
    findByDateRange: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: BarbershopsService,
          useValue: mockBarbershopsService,
        },
        {
          provide: AppointmentsService,
          useValue: mockAppointmentsService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const mockUsers: User[] = [
        {
          id: 1,
          email: 'user1@example.com',
          password: 'password',
          role: UserRole.CLIENT,
          profile: null,
          appointments: [],
        },
        {
          id: 2,
          email: 'user2@example.com',
          password: 'password',
          role: UserRole.BARBER,
          profile: null,
          appointments: [],
        },
      ];

      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const result: User[] = await controller.getUsers();

      expect(result).toEqual(mockUsers);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('getBarbershops', () => {
    it('should return all barbershops', async () => {
      const mockBarbershops: Barbershop[] = [
        {
          id: 1,
          name: 'Barbershop 1',
          address: '123 Main St',
          schedule: '9-5',
          barbers: [],
          appointments: [],
        },
        {
          id: 2,
          name: 'Barbershop 2',
          address: '456 Oak St',
          schedule: '9-5',
          barbers: [],
          appointments: [],
        },
      ];

      mockBarbershopsService.getBarbershops.mockResolvedValue(mockBarbershops);

      const result: Barbershop[] = await controller.getBarbershops();

      expect(result).toEqual(mockBarbershops);
      expect(mockBarbershopsService.getBarbershops).toHaveBeenCalled();
    });
  });

  describe('getAppointments', () => {
    const mockAppointments: Appointment[] = [
      {
        id: 1,
        date: new Date('2025-09-10'),
        status: 'confirmed',
        user: null,
        barber: null,
        barbershop: null,
      },
      {
        id: 2,
        date: new Date('2025-09-11'),
        status: 'pending',
        user: null,
        barber: null,
        barbershop: null,
      },
    ];

    beforeEach(() => {
      mockAppointmentsService.findAll.mockClear();
      mockAppointmentsService.findByDateRange.mockClear();
    });

    it('should return all appointments when no date range is provided', async () => {
      mockAppointmentsService.findAll.mockResolvedValue(mockAppointments);

      const result: Appointment[] = await controller.getAppointments();

      expect(result).toEqual(mockAppointments);
      expect(mockAppointmentsService.findAll).toHaveBeenCalled();
    });

    it('should return appointments within date range when both dates provided', async () => {
      const startDate = '2025-09-10';
      const endDate = '2025-09-11';

      mockAppointmentsService.findByDateRange.mockResolvedValue(
        mockAppointments,
      );

      const result: Appointment[] = await controller.getAppointments(
        startDate,
        endDate,
      );

      expect(result).toEqual(mockAppointments);
      expect(mockAppointmentsService.findByDateRange).toHaveBeenCalledWith(
        startDate,
        endDate,
      );
    });

    it('should return all appointments when only startDate is provided', async () => {
      const startDate = '2025-09-10';
      mockAppointmentsService.findAll.mockResolvedValue(mockAppointments);

      const result: Appointment[] = await controller.getAppointments(
        startDate,
        undefined,
      );

      expect(result).toEqual(mockAppointments);
      expect(mockAppointmentsService.findAll).toHaveBeenCalled();
    });

    it('should return all appointments when only endDate is provided', async () => {
      const endDate = '2025-09-11';
      mockAppointmentsService.findAll.mockResolvedValue(mockAppointments);

      const result: Appointment[] = await controller.getAppointments(
        undefined,
        endDate,
      );

      expect(result).toEqual(mockAppointments);
      expect(mockAppointmentsService.findAll).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return success message', async () => {
      const userId = 1;
      mockUsersService.delete.mockResolvedValue(true);

      const result: { message: string } = await controller.deleteUser(userId);

      expect(result).toEqual({ message: 'User deleted successfully' });
      expect(mockUsersService.delete).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 999;
      mockUsersService.delete.mockResolvedValue(false);

      await expect(controller.deleteUser(userId)).rejects.toThrowError(
        'User not found',
      );
    });
  });

  describe('deleteBarbershop', () => {
    it('should delete a barbershop and return success message', async () => {
      const barbershopId = 1;
      mockBarbershopsService.deleteBarbershop.mockResolvedValue(true);

      const result: { message: string } =
        await controller.deleteBarbershop(barbershopId);

      expect(result).toEqual({ message: 'Barbershop deleted successfully' });
      expect(mockBarbershopsService.deleteBarbershop).toHaveBeenCalledWith(
        barbershopId,
      );
    });

    it('should throw NotFoundException if barbershop not found', async () => {
      const barbershopId = 999;
      mockBarbershopsService.deleteBarbershop.mockResolvedValue(false);

      await expect(controller.deleteBarbershop(barbershopId)).rejects.toThrowError(
        'Barbershop not found',
      );
    });
  });

  describe('getDashboard', () => {
    it('should return dashboard statistics', async () => {
      const expected: {
        users: number;
        appointments: number;
        barbershops: number;
      } = {
        users: 100,
        appointments: 50,
        barbershops: 10,
      };

      const result = await controller.getDashboard();

      expect(result).toEqual(expected);
    });
  });
});
