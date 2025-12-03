import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should allow access when no roles are required', () => {
      const context = {
        getHandler: () => ({}),
        getClass: () => ({}),
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: 'client' },
          }),
        }),
      } as ExecutionContext;

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow access when user has required role', () => {
      const context = {
        getHandler: () => ({}),
        getClass: () => ({}),
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: 'admin' },
          }),
        }),
      } as ExecutionContext;

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should deny access when user does not have required role', () => {
      const context = {
        getHandler: () => ({}),
        getClass: () => ({}),
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: 'client' },
          }),
        }),
      } as ExecutionContext;

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

      expect(guard.canActivate(context)).toBe(false);
    });

    it('should deny access when user is not authenticated', () => {
      const context = {
        getHandler: () => ({}),
        getClass: () => ({}),
        switchToHttp: () => ({
          getRequest: () => ({}),
        }),
      } as ExecutionContext;

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

      expect(guard.canActivate(context)).toBe(false);
    });
  });
});

describe('Roles Decorator', () => {
  it('should set metadata with provided roles', () => {
    const roles = ['admin', 'barber'];
    
    // Mock class with decorated method
    class TestClass {
      @Roles(...roles)
      testMethod() {}
    }

    const reflector = new Reflector();
    const metadata = reflector.get('roles', TestClass.prototype.testMethod);
    expect(metadata).toEqual(roles);
  });
});
