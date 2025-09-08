import { Controller, Get } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  @Get('dashboard')
  getDashboard() {
    // Simulación de estadísticas
    return {
      users: 100,
      appointments: 50,
      barbershops: 10,
    };
  }
}
