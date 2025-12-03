import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentsService } from './appointments.service';
import { Appointment } from '../entities/appointment.entity';
import { User } from '../entities/user.entity';
import { Barber } from '../entities/barber.entity';
import { Barbershop } from '../entities/barbershop.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let appointmentRepository: MockRepository<Appointment>;

  const mockAppointment: Appointment = {
    id: 1,
    date: new Date(),
    status: 'pending',
    user: null,
    barber: null,
    barbershop: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Barber),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Barbershop),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    appointmentRepository = module.get(getRepositoryToken(Appointment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new appointment', async () => {
      const appointmentData = { date: new Date(), status: 'pending' };
      appointmentRepository.create.mockReturnValue(appointmentData as any);
      appointmentRepository.save.mockResolvedValue(mockAppointment);

      const result = await service.create(appointmentData);

      expect(appointmentRepository.create).toHaveBeenCalledWith(
        appointmentData,
      );
      expect(appointmentRepository.save).toHaveBeenCalledWith(appointmentData);
      expect(result).toEqual(mockAppointment);
    });
  });

  describe('findAll', () => {
    it('should return an array of appointments', async () => {
      const appointments = [mockAppointment];
      appointmentRepository.find.mockResolvedValue(appointments);

      const result = await service.findAll();

      expect(result).toEqual(appointments);
      expect(appointmentRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'barber', 'barbershop'],
      });
    });
  });

  describe('update', () => {
    it('should update and return the appointment', async () => {
      const updatedData = { status: 'confirmed' };
      const updatedAppointment = { ...mockAppointment, ...updatedData };

      appointmentRepository.findOne.mockResolvedValue(mockAppointment);
      appointmentRepository.save.mockResolvedValue(updatedAppointment);

      const result = await service.update(1, updatedData);

      expect(appointmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(appointmentRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updatedData),
      );
      expect(result).toEqual(updatedAppointment);
    });

    it('should return null if appointment not found', async () => {
      appointmentRepository.findOne.mockResolvedValue(null);
      const result = await service.update(1, { status: 'confirmed' });
      expect(result).toBeNull();
    });
  });

  describe('cancel', () => {
    it('should cancel an appointment', async () => {
      const cancelledAppointment = { ...mockAppointment, status: 'cancelled' };
      const updateSpy = jest
        .spyOn(service, 'update')
        .mockResolvedValue(cancelledAppointment);

      const result = await service.cancel(1);

      expect(updateSpy).toHaveBeenCalledWith(1, { status: 'cancelled' });
      expect(result).toEqual(cancelledAppointment);
    });
  });
});
