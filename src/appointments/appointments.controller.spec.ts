import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let appointmentsService: AppointmentsService;

  const mockAppointmentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    cancel: jest.fn(),
  };

  let mockAppointment: any;

  beforeEach(() => {
    const now = new Date();
    mockAppointment = {
      id: 1,
      date: now,
      status: 'pending',
      userId: 1,
      barberId: 1,
      barbershopId: 1,
    };
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: mockAppointmentsService,
        },
      ],
    }).compile();

    controller = module.createNestApplication().get<AppointmentsController>(AppointmentsController);
    appointmentsService = module.createNestApplication().get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create and return an appointment', async () => {
      const appointmentDate = new Date();
      const createAppointmentDto: CreateAppointmentDto = {
        date: appointmentDate.toISOString(),
        status: 'pending',
        userId: 1,
        barberId: 1,
        barbershopId: 1,
      };

      mockAppointmentsService.create.mockImplementation(dto => ({
        ...mockAppointment,
        date: new Date(dto.date),
      }));

      const result = await controller.create(createAppointmentDto);

      const expected = {
        ...mockAppointment,
        date: appointmentDate,
      };

      expect(result).toEqual(expected);
      expect(mockAppointmentsService.create).toHaveBeenCalledWith({
        ...createAppointmentDto,
        date: appointmentDate,
      });
    });

    it('should throw an error if appointment creation fails with null', async () => {
      const createAppointmentDto: CreateAppointmentDto = {
        date: new Date().toISOString(),
        status: 'pending',
        userId: 1,
        barberId: 1,
        barbershopId: 1,
      };

      mockAppointmentsService.create.mockResolvedValue(null);

      await expect(controller.create(createAppointmentDto)).rejects.toThrow('Failed to create appointment');
    });

    it('should throw an error if appointment creation fails with exception', async () => {
      const createAppointmentDto: CreateAppointmentDto = {
        date: new Date().toISOString(),
        status: 'pending',
        userId: 1,
        barberId: 1,
        barbershopId: 1,
      };

      mockAppointmentsService.create.mockRejectedValue(new Error('Failed to create appointment'));

      await expect(controller.create(createAppointmentDto)).rejects.toThrow('Failed to create appointment');
    });

    it('should throw an error if date is invalid', async () => {
      const createAppointmentDto: CreateAppointmentDto = {
        date: 'invalid-date',
        status: 'pending',
        userId: 1,
        barberId: 1,
        barbershopId: 1,
      };

      await expect(controller.create(createAppointmentDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return an array of appointments', async () => {
      mockAppointmentsService.findAll.mockResolvedValue([mockAppointment]);

      const result = await controller.findAll();

      expect(result).toEqual([mockAppointment]);
      expect(mockAppointmentsService.findAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return the appointment', async () => {
      const updateAppointmentDto = { status: 'confirmed' as 'pending' | 'confirmed' | 'cancelled' };
      const updatedAppointment = { ...mockAppointment, ...updateAppointmentDto };

      mockAppointmentsService.update.mockResolvedValue(updatedAppointment);

      const result = await controller.update(1, updateAppointmentDto);

      expect(result).toEqual(updatedAppointment);
      expect(mockAppointmentsService.update).toHaveBeenCalledWith(1, updateAppointmentDto);
    });

    it('should throw NotFoundException if appointment not found', async () => {
      const updateAppointmentDto = { status: 'confirmed' as 'pending' | 'confirmed' | 'cancelled' };

      mockAppointmentsService.update.mockResolvedValue(null);

      await expect(controller.update(1, updateAppointmentDto)).rejects.toThrow('Appointment not found');
    });
  });

  describe('cancel', () => {
    it('should cancel and return the appointment', async () => {
      const cancelledAppointment = { ...mockAppointment, status: 'cancelled' };

      mockAppointmentsService.cancel.mockResolvedValue(cancelledAppointment);

      const result = await controller.cancel(1);

      expect(result).toEqual(cancelledAppointment);
      expect(mockAppointmentsService.cancel).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if appointment not found', async () => {
      mockAppointmentsService.cancel.mockResolvedValue(null);

      await expect(controller.cancel(1)).rejects.toThrow('Appointment not found');
    });
  });
});
