import { Test, TestingModule } from '@nestjs/testing';
import { BarbershopsController } from './barbershops.controller';
import { BarbershopsService } from './barbershops.service';
import { CreateBarbershopDto } from '../dto/create-barbershop.dto';

describe('BarbershopsController', () => {
  let controller: BarbershopsController;
  let barbershopsService: BarbershopsService;

  const mockBarbershopsService = {
    createBarbershop: jest.fn(),
    getBarbershops: jest.fn(),
    addBarber: jest.fn(),
  };

  const mockBarbershop = {
    id: 1,
    name: 'Test Barbershop',
    address: '123 Test St',
    barbers: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BarbershopsController],
      providers: [
        {
          provide: BarbershopsService,
          useValue: mockBarbershopsService,
        },
      ],
    }).compile();

    controller = module.createNestApplication().get<BarbershopsController>(BarbershopsController);
    barbershopsService = module.createNestApplication().get<BarbershopsService>(BarbershopsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createBarbershop', () => {
    it('should create and return a barbershop', async () => {
      const createBarbershopDto: CreateBarbershopDto = {
        name: 'Test Barbershop',
        address: '123 Test St',
      };

      mockBarbershopsService.createBarbershop.mockResolvedValue(mockBarbershop);

      const result = await controller.createBarbershop(createBarbershopDto);

      expect(result).toEqual(mockBarbershop);
      expect(mockBarbershopsService.createBarbershop).toHaveBeenCalledWith(createBarbershopDto);
    });
  });

  describe('getBarbershops', () => {
    it('should return an array of barbershops', async () => {
      mockBarbershopsService.getBarbershops.mockResolvedValue([mockBarbershop]);

      const result = await controller.getBarbershops();

      expect(result).toEqual([mockBarbershop]);
      expect(mockBarbershopsService.getBarbershops).toHaveBeenCalled();
    });
  });

  describe('addBarber', () => {
    it('should add a barber to a barbershop', async () => {
      const mockBarber = {
        id: 1,
        name: 'Test Barber',
        specialties: ['classic cuts'],
      };

      const barbershopWithBarber = {
        ...mockBarbershop,
        barbers: [mockBarber],
      };

      mockBarbershopsService.addBarber.mockResolvedValue(barbershopWithBarber);

      const result = await controller.addBarber(1, mockBarber);

      expect(result).toEqual(barbershopWithBarber);
      expect(mockBarbershopsService.addBarber).toHaveBeenCalledWith(1, mockBarber);
    });

    it('should throw NotFoundException if barbershop not found', async () => {
      const mockBarber = {
        id: 1,
        name: 'Test Barber',
        specialties: ['classic cuts'],
      };

      mockBarbershopsService.addBarber.mockRejectedValue(new Error('Barbershop not found'));

      await expect(controller.addBarber(1, mockBarber)).rejects.toThrow('Barbershop not found');
    });
  });
});
