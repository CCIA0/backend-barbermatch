
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BarbershopsService } from './barbershops.service';
import { Barbershop } from '../entities/barbershop.entity';
import { Barber } from '../entities/barber.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

describe('BarbershopsService', () => {
  let service: BarbershopsService;
  let barbershopRepository: MockRepository<Barbershop>;
  let barberRepository: MockRepository<Barber>;

  const mockBarbershop: Barbershop = {
    id: 1,
    name: 'The Classic Barber',
    address: '123 Main St',
    schedule: 'Mon-Fri 9-5',
    barbers: [],
    appointments: [],
  };

  const mockBarber: Barber = {
    id: 1,
    name: 'John Doe',
    barbershop: mockBarbershop,
    appointments: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BarbershopsService,
        {
          provide: getRepositoryToken(Barbershop),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Barber),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<BarbershopsService>(BarbershopsService);
    barbershopRepository = module.get(getRepositoryToken(Barbershop));
    barberRepository = module.get(getRepositoryToken(Barber));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBarbershop', () => {
    it('should create and save a new barbershop', async () => {
      const barbershopData = { name: 'New Shop' };
      barbershopRepository.create.mockReturnValue(barbershopData as any);
      barbershopRepository.save.mockResolvedValue(mockBarbershop);

      const result = await service.createBarbershop(barbershopData);

      expect(barbershopRepository.create).toHaveBeenCalledWith(barbershopData);
      expect(barbershopRepository.save).toHaveBeenCalledWith(barbershopData);
      expect(result).toEqual(mockBarbershop);
    });
  });

  describe('getBarbershops', () => {
    it('should return an array of barbershops', async () => {
      const barbershops = [mockBarbershop];
      barbershopRepository.find.mockResolvedValue(barbershops);

      const result = await service.getBarbershops();

      expect(result).toEqual(barbershops);
      expect(barbershopRepository.find).toHaveBeenCalledWith({
        relations: ['barbers', 'appointments'],
      });
    });
  });

  describe('addBarber', () => {
    it('should add a barber to a barbershop', async () => {
      const barberData = { name: 'Jane Doe' };
      barbershopRepository.findOne.mockResolvedValue(mockBarbershop);
      barberRepository.create.mockReturnValue(barberData as any);
      barberRepository.save.mockResolvedValue(mockBarber);

      const result = await service.addBarber(1, barberData);

      expect(barbershopRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(barberRepository.create).toHaveBeenCalledWith({
        ...barberData,
        barbershop: mockBarbershop,
      });
      expect(barberRepository.save).toHaveBeenCalledWith(barberData);
      expect(result).toEqual(mockBarber);
    });

    it('should throw an error if barbershop not found', async () => {
      barbershopRepository.findOne.mockResolvedValue(null);
      await expect(service.addBarber(1, {})).rejects.toThrow('Barbershop not found');
    });
  });
});
