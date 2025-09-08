import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async sendNotification(userId: number, message: string): Promise<boolean> {
    // Aquí iría la integración con OneSignal
    // Simulación de envío
    console.log(`Notificación enviada a usuario ${userId}: ${message}`);
    return true;
  }

  async sendAppointmentReminder(
    userId: number,
    appointmentId: number,
  ): Promise<boolean> {
    // Simulación de recordatorio
    return this.sendNotification(
      userId,
      `Recordatorio de cita #${appointmentId}`,
    );
  }
}
