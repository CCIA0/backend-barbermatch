import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendNotification', () => {
    it('should log a notification message and return true', async () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});
      const result = await service.sendNotification(1, 'Test message');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Notificación enviada a usuario 1: Test message',
      );
      expect(result).toBe(true);

      consoleSpy.mockRestore();
    });
  });

  describe('sendAppointmentReminder', () => {
    it('should call sendNotification with the correct reminder message', async () => {
      const sendNotificationSpy = jest
        .spyOn(service, 'sendNotification')
        .mockResolvedValue(true);
      const result = await service.sendAppointmentReminder(1, 123);

      expect(sendNotificationSpy).toHaveBeenCalledWith(
        1,
        'Recordatorio de cita #123',
      );
      expect(result).toBe(true);

      sendNotificationSpy.mockRestore();
    });
  });
});
