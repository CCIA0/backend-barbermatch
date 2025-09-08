import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';

import { AppointmentsService } from './appointments/appointments.service';
import { AppointmentsController } from './appointments/appointments.controller';

import { BarbershopsService } from './barbershops/barbershops.service';
import { BarbershopsController } from './barbershops/barbershops.controller';

import { HairstylesService } from './hairstyles/hairstyles.service';
import { HairstylesController } from './hairstyles/hairstyles.controller';

import { VisagismService } from './visagism/visagism.service';
import { VisagismController } from './visagism/visagism.controller';

import { NotificationsService } from './notifications/notifications.service';

import { AdminController } from './admin/admin.controller';

import { RolesGuard } from './common/roles.guard';
import { Roles } from './common/roles.decorator';
import { CreateHairstyleDto } from './dto/create-hairstyle.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

jest.mock('bcrypt', () => ({
  __esModule: true,
  compare: jest.fn(),
  hash: jest.fn(),
}));

// Helper para crear repositorios mock de TypeORM
function createRepoMock<T>(overrides: Partial<Record<keyof any, any>> = {}) {
  return {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
    ...overrides,
  } as any as Record<string, jest.Mock>;
}

// Auth
describe('AuthService', () => {
  const usersRepo = createRepoMock();
  const jwtService: Partial<JwtService> = {
    sign: jest.fn().mockReturnValue('token'),
  };
  const service = new AuthService(usersRepo as any, jwtService as JwtService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('validateUser - éxito retorna user sin password y token', async () => {
    const user = {
      id: 1,
      email: 'a@a.com',
      password: 'hashed',
      role: 'client',
    } as any;
    usersRepo.findOne.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true as any);

    const res = await service.validateUser('a@a.com', 'secret');
    expect(res).toEqual({
      user: { id: 1, email: 'a@a.com', role: 'client' },
      access_token: 'token',
    });
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 1,
      email: 'a@a.com',
      role: 'client',
    });
  });

  it('validateUser - credenciales inválidas retorna null', async () => {
    usersRepo.findOne.mockResolvedValue({
      id: 1,
      email: 'a@a.com',
      password: 'x',
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false as any);
    const res = await service.validateUser('a@a.com', 'bad');
    expect(res).toBeNull();
  });

  it('register - hashea password y guarda usuario', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed' as any);
    const created = {
      id: 1,
      email: 'a@a.com',
      password: 'hashed',
      role: 'client',
    };
    usersRepo.create.mockReturnValue(created);
    usersRepo.save.mockResolvedValue(created);

    const res = await service.register('a@a.com', 'secret', 'client');
    expect(bcrypt.hash).toHaveBeenCalledWith('secret', 10);
    expect(usersRepo.create).toHaveBeenCalledWith({
      email: 'a@a.com',
      password: 'hashed',
      role: 'client',
    });
    expect(res).toBe(created);
  });
});

describe('AuthController', () => {
  const authService = {
    register: jest.fn(),
    validateUser: jest.fn(),
  } as any as AuthService;
  const controller = new AuthController(authService);

  beforeEach(() => jest.clearAllMocks());

  it('register - delega al servicio', async () => {
    const dto = { email: 'a@a.com', password: 'secret', role: 'client' } as any;
    authService.register = jest.fn().mockResolvedValue({ id: 1 });
    const res = await controller.register(dto);
    expect(authService.register).toHaveBeenCalledWith(
      'a@a.com',
      'secret',
      'client',
    );
    expect(res).toEqual({ id: 1 });
  });

  it('login - delega al servicio', async () => {
    authService.validateUser = jest
      .fn()
      .mockResolvedValue({ user: { id: 1 }, access_token: 't' });
    const res = await controller.login({
      email: 'a@a.com',
      password: 'secret',
    });
    expect(authService.validateUser).toHaveBeenCalledWith('a@a.com', 'secret');
    expect(res).toEqual({ user: { id: 1 }, access_token: 't' });
  });
});

// Users
describe('UsersService', () => {
  const usersRepo = createRepoMock();
  const profilesRepo = createRepoMock();
  const service = new UsersService(usersRepo as any, profilesRepo as any);

  beforeEach(() => jest.clearAllMocks());

  it('findMe - consulta por id con relations', async () => {
    usersRepo.findOne.mockResolvedValue({ id: 1, profile: {} });
    const res = await service.findMe(1);
    expect(usersRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['profile'],
    });
    expect(res).toEqual({ id: 1, profile: {} });
  });

  it('findById - retorna usuario o null', async () => {
    usersRepo.findOne.mockResolvedValueOnce(null);
    const res1 = await service.findById(2);
    expect(res1).toBeNull();
    usersRepo.findOne.mockResolvedValueOnce({ id: 2 });
    const res2 = await service.findById(2);
    expect(res2).toEqual({ id: 2 });
  });

  it('updateProfile - actualiza cuando existe, si no retorna null', async () => {
    profilesRepo.findOne.mockResolvedValueOnce(null);
    const r1 = await service.updateProfile(1, { name: 'x' });
    expect(r1).toBeNull();

    const profile = { id: 1, name: 'old' } as any;
    profilesRepo.findOne.mockResolvedValueOnce(profile);
    profilesRepo.save.mockResolvedValue({ id: 1, name: 'new' });
    const r2 = await service.updateProfile(1, { name: 'new' });
    expect(profilesRepo.save).toHaveBeenCalledWith({ id: 1, name: 'new' });
    expect(r2).toEqual({ id: 1, name: 'new' });
  });
});

describe('UsersController', () => {
  const svc = {
    findMe: jest.fn(),
    findById: jest.fn(),
    updateProfile: jest.fn(),
  } as any as UsersService;
  const controller = new UsersController(svc);

  beforeEach(() => jest.clearAllMocks());

  it('getMe - delega al servicio', async () => {
    svc.findMe = jest.fn().mockResolvedValue({ id: 1 });
    const res = await controller.getMe(1 as any);
    expect(svc.findMe).toHaveBeenCalledWith(1);
    expect(res).toEqual({ id: 1 });
  });

  it('getById - delega al servicio', async () => {
    svc.findById = jest.fn().mockResolvedValue({ id: 2 });
    const res = await controller.getById(2 as any);
    expect(svc.findById).toHaveBeenCalledWith(2);
    expect(res).toEqual({ id: 2 });
  });

  it('updateProfile - delega al servicio', async () => {
    svc.updateProfile = jest.fn().mockResolvedValue({ id: 1, name: 'n' });
    const res = await controller.updateProfile(1 as any, { name: 'n' } as any);
    expect(svc.updateProfile).toHaveBeenCalledWith(1, { name: 'n' });
    expect(res).toEqual({ id: 1, name: 'n' });
  });
});

// Appointments
describe('AppointmentsService', () => {
  const appRepo = createRepoMock();
  const userRepo = createRepoMock();
  const barberRepo = createRepoMock();
  const shopRepo = createRepoMock();
  const service = new AppointmentsService(
    appRepo as any,
    userRepo as any,
    barberRepo as any,
    shopRepo as any,
  );

  beforeEach(() => jest.clearAllMocks());

  it('create - crea y guarda', async () => {
    const data = { date: new Date(), status: 'pending' } as any;
    appRepo.create.mockReturnValue(data);
    appRepo.save.mockResolvedValue({ id: 1, ...data });
    const res = await service.create(data);
    expect(appRepo.create).toHaveBeenCalledWith(data);
    expect(res).toEqual({ id: 1, ...data });
  });

  it('findAll - retorna citas con relaciones', async () => {
    const rows = [{ id: 1 }];
    appRepo.find.mockResolvedValue(rows);
    const res = await service.findAll();
    expect(appRepo.find).toHaveBeenCalledWith({
      relations: ['user', 'barber', 'barbershop'],
    });
    expect(res).toBe(rows);
  });

  it('update - actualiza cuando existe, si no retorna null', async () => {
    appRepo.findOne.mockResolvedValueOnce(null);
    const r1 = await service.update(1, { status: 'confirmed' } as any);
    expect(r1).toBeNull();

    const entity = { id: 1, status: 'pending' } as any;
    appRepo.findOne.mockResolvedValueOnce(entity);
    appRepo.save.mockResolvedValue({ id: 1, status: 'confirmed' });
    const r2 = await service.update(1, { status: 'confirmed' } as any);
    expect(appRepo.save).toHaveBeenCalledWith({ id: 1, status: 'confirmed' });
    expect(r2).toEqual({ id: 1, status: 'confirmed' });
  });

  it('cancel - delega a update con estado cancelled', async () => {
    const spy = jest
      .spyOn(service, 'update')
      .mockResolvedValue({ id: 1, status: 'cancelled' } as any);
    const res = await service.cancel(1);
    expect(spy).toHaveBeenCalledWith(1, { status: 'cancelled' });
    expect(res).toEqual({ id: 1, status: 'cancelled' });
  });
});

describe('AppointmentsController', () => {
  const svc = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    cancel: jest.fn(),
  } as any as AppointmentsService;
  const controller = new AppointmentsController(svc);

  beforeEach(() => jest.clearAllMocks());

  it('create - transforma date a Date', async () => {
    const dto = {
      date: new Date().toISOString(),
      status: 'pending',
      userId: 1,
      barberId: 2,
      barbershopId: 3,
    } as any;
    svc.create = jest
      .fn()
      .mockResolvedValue({ id: 1, ...dto, date: new Date(dto.date) });
    await controller.create(dto);
    expect(svc.create).toHaveBeenCalledWith(
      expect.objectContaining({ date: expect.any(Date) }),
    );
  });

  it('getAll - delega al servicio', async () => {
    svc.findAll = jest.fn().mockResolvedValue([]);
    const res = await controller.getAll();
    expect(res).toEqual([]);
  });

  it('update - delega al servicio', async () => {
    svc.update = jest.fn().mockResolvedValue({ id: 1 });
    const res = await controller.update(
      1 as any,
      { status: 'confirmed' } as any,
    );
    expect(svc.update).toHaveBeenCalledWith(1, { status: 'confirmed' });
    expect(res).toEqual({ id: 1 });
  });

  it('cancel - delega al servicio', async () => {
    svc.cancel = jest.fn().mockResolvedValue({ id: 1, status: 'cancelled' });
    const res = await controller.cancel(1 as any);
    expect(svc.cancel).toHaveBeenCalledWith(1);
    expect(res).toEqual({ id: 1, status: 'cancelled' });
  });
});

// Barbershops
describe('BarbershopsService', () => {
  const shopRepo = createRepoMock();
  const barberRepo = createRepoMock();
  const service = new BarbershopsService(shopRepo as any, barberRepo as any);

  beforeEach(() => jest.clearAllMocks());

  it('createBarbershop - crea y guarda', async () => {
    const data = { name: 'A', address: 'B' } as any;
    shopRepo.create.mockReturnValue(data);
    shopRepo.save.mockResolvedValue({ id: 1, ...data });
    const res = await service.createBarbershop(data);
    expect(shopRepo.create).toHaveBeenCalledWith(data);
    expect(res).toEqual({ id: 1, ...data });
  });

  it('getBarbershops - retorna con relaciones', async () => {
    shopRepo.find.mockResolvedValue([{ id: 1 }]);
    const res = await service.getBarbershops();
    expect(shopRepo.find).toHaveBeenCalledWith({
      relations: ['barbers', 'appointments'],
    });
    expect(res).toEqual([{ id: 1 }]);
  });

  it('addBarber - lanza error si no existe barbershop', async () => {
    shopRepo.findOne.mockResolvedValue(null);
    await expect(service.addBarber(1, { name: 'J' } as any)).rejects.toThrow(
      'Barbershop not found',
    );
  });

  it('addBarber - crea y guarda barber asociado', async () => {
    shopRepo.findOne.mockResolvedValue({ id: 1 });
    const barber = { id: 2, name: 'J' } as any;
    barberRepo.create.mockReturnValue(barber);
    barberRepo.save.mockResolvedValue(barber);
    const res = await service.addBarber(1, { name: 'J' } as any);
    expect(barberRepo.create).toHaveBeenCalledWith({
      name: 'J',
      barbershop: { id: 1 },
    });
    expect(res).toBe(barber);
  });
});

describe('BarbershopsController', () => {
  const svc = {
    createBarbershop: jest.fn(),
    getBarbershops: jest.fn(),
    addBarber: jest.fn(),
  } as any as BarbershopsService;
  const controller = new BarbershopsController(svc);

  beforeEach(() => jest.clearAllMocks());

  it('create - delega', async () => {
    svc.createBarbershop = jest.fn().mockResolvedValue({ id: 1 });
    const res = await controller.create({ name: 'A' } as any);
    expect(svc.createBarbershop).toHaveBeenCalledWith({ name: 'A' });
    expect(res).toEqual({ id: 1 });
  });

  it('getAll - delega', async () => {
    svc.getBarbershops = jest.fn().mockResolvedValue([]);
    const res = await controller.getAll();
    expect(res).toEqual([]);
  });

  it('addBarber - delega', async () => {
    svc.addBarber = jest.fn().mockResolvedValue({ id: 2 });
    const res = await controller.addBarber(1 as any, { name: 'J' } as any);
    expect(svc.addBarber).toHaveBeenCalledWith(1, { name: 'J' });
    expect(res).toEqual({ id: 2 });
  });
});

// Hairstyles
describe('HairstylesService', () => {
  const repo = createRepoMock();
  const service = new HairstylesService(repo as any);

  beforeEach(() => jest.clearAllMocks());

  it('create - crea y guarda', async () => {
    const data = { name: 'Buzz' } as any;
    repo.create.mockReturnValue(data);
    repo.save.mockResolvedValue({ id: 1, ...data });
    const res = await service.create(data);
    expect(repo.create).toHaveBeenCalledWith(data);
    expect(res).toEqual({ id: 1, ...data });
  });

  it('findAll - retorna todos', async () => {
    repo.find.mockResolvedValue([{ id: 1 }]);
    const res = await service.findAll();
    expect(repo.find).toHaveBeenCalled();
    expect(res).toEqual([{ id: 1 }]);
  });

  it('findByFaceShape - usa queryBuilder y retorna', async () => {
    const qb = {
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([{ id: 2 }]),
    };
    repo.createQueryBuilder.mockReturnValue(qb);
    const res = await service.findByFaceShape('oval');
    expect(repo.createQueryBuilder).toHaveBeenCalledWith('hairstyle');
    expect(qb.where).toHaveBeenCalledWith(
      ':faceShape = ANY(hairstyle.recommendedFaceShapes)',
      { faceShape: 'oval' },
    );
    expect(res).toEqual([{ id: 2 }]);
  });
});

describe('HairstylesController', () => {
  const svc = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByFaceShape: jest.fn(),
  } as any as HairstylesService;
  const controller = new HairstylesController(svc);

  beforeEach(() => jest.clearAllMocks());

  it('create - delega', async () => {
    svc.create = jest.fn().mockResolvedValue({ id: 1 });
    const res = await controller.create({ name: 'Buzz' } as any);
    expect(svc.create).toHaveBeenCalledWith({ name: 'Buzz' });
    expect(res).toEqual({ id: 1 });
  });

  it('getAll - delega', async () => {
    svc.findAll = jest.fn().mockResolvedValue([]);
    const res = await controller.getAll();
    expect(res).toEqual([]);
  });

  it('filterByFaceShape - delega', async () => {
    svc.findByFaceShape = jest.fn().mockResolvedValue([{ id: 2 }]);
    const res = await controller.filterByFaceShape('oval');
    expect(svc.findByFaceShape).toHaveBeenCalledWith('oval');
    expect(res).toEqual([{ id: 2 }]);
  });
});

// Visagism
describe('VisagismService', () => {
  const repo = createRepoMock();
  const service = new VisagismService(repo as any);

  beforeEach(() => jest.clearAllMocks());

  it('analyzeImage - crea resultado simulado y guarda', async () => {
    const result = { id: 1, faceShape: 'oval', confidence: 0.95 } as any;
    repo.create.mockReturnValue(result);
    repo.save.mockResolvedValue(result);
    const res = await service.analyzeImage({ some: 'data' });
    expect(repo.create).toHaveBeenCalledWith({
      faceShape: 'oval',
      confidence: 0.95,
    });
    expect(res).toBe(result);
  });
});

describe('VisagismController', () => {
  const svc = { analyzeImage: jest.fn() } as any as VisagismService;
  const controller = new VisagismController(svc);

  beforeEach(() => jest.clearAllMocks());

  it('analyze - delega', async () => {
    svc.analyzeImage = jest.fn().mockResolvedValue({ id: 1 });
    const res = await controller.analyze({ image: 'x' });
    expect(svc.analyzeImage).toHaveBeenCalledWith('x');
    expect(res).toEqual({ id: 1 });
  });
});

// Notifications
describe('NotificationsService', () => {
  const service = new NotificationsService();

  beforeEach(() => jest.clearAllMocks());

  it('sendNotification - retorna true y loguea', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const res = await service.sendNotification(1, 'Hola');
    expect(spy).toHaveBeenCalled();
    expect(res).toBe(true);
  });

  it('sendAppointmentReminder - delega a sendNotification', async () => {
    const spy = jest.spyOn(service, 'sendNotification').mockResolvedValue(true);
    const res = await service.sendAppointmentReminder(1, 10);
    expect(spy).toHaveBeenCalledWith(1, 'Recordatorio de cita #10');
    expect(res).toBe(true);
  });
});

// Admin
describe('AdminController', () => {
  const controller = new AdminController();
  it('getDashboard - retorna estadísticas simuladas', () => {
    const res = controller.getDashboard();
    expect(res).toEqual({ users: 100, appointments: 50, barbershops: 10 });
  });
});

// RolesGuard
describe('RolesGuard', () => {
  const reflector = {
    getAllAndOverride: jest.fn(),
  } as any;
  const guard = new RolesGuard(reflector);

  function createContext(user: any) {
    return {
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as any;
  }

  beforeEach(() => jest.clearAllMocks());

  it('sin roles requeridos permite acceso', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const can = guard.canActivate(createContext({ role: 'client' }));
    expect(can).toBe(true);
  });

  it('con roles requeridos permite si el usuario cumple', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin']);
    const can = guard.canActivate(createContext({ role: 'admin' }));
    expect(can).toBe(true);
  });

  it('con roles requeridos deniega si el usuario no cumple', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin']);
    const can = guard.canActivate(createContext({ role: 'client' }));
    expect(can).toBe(false);
  });
});

// Roles decorator

describe('Roles decorator', () => {
  it('aplica metadata de roles en clase', () => {
    class TestClass {}
    const decorator = Roles('admin', 'barber');
    (decorator as any)(TestClass);
    const rolesMeta = Reflect.getMetadata('roles', TestClass);
    expect(rolesMeta).toEqual(['admin', 'barber']);
  });
});

// CreateHairstyleDto validation

describe('CreateHairstyleDto', () => {
  it('valida correctamente un payload válido', async () => {
    const payload = { name: 'Buzz', recommendedFaceShapes: ['oval', 'round'] };
    const dto = plainToInstance(CreateHairstyleDto, payload);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('detecta errores en payload inválido', async () => {
    const payload = { name: 123, recommendedFaceShapes: ['oval', 7] } as any;
    const dto = plainToInstance(CreateHairstyleDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
