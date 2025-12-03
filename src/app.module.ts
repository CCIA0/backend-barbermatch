import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { Appointment } from './entities/appointment.entity';
import { Barbershop } from './entities/barbershop.entity';
import { Barber } from './entities/barber.entity';
import { Hairstyle } from './entities/hairstyle.entity';
import { FaceAnalysisResult } from './entities/face-analysis-result.entity';
import { AdminModule } from './admin/admin.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { BarbershopsModule } from './barbershops/barbershops.module';
import { HairstylesModule } from './hairstyles/hairstyles.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UsersModule } from './users/users.module';
import { VisagismModule } from './visagism/visagism.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'barbermatch_user',
      password: 'barber123',
      database: 'barber_db',
      entities: [
        User,
        UserProfile,
        Appointment,
        Barbershop,
        Barber,
        Hairstyle,
        FaceAnalysisResult,
      ],
      synchronize: true, // Cambia a false en producción
    }),
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      Appointment,
      Barbershop,
      Barber,
      Hairstyle,
      FaceAnalysisResult,
    ]),
    AdminModule,
    AppointmentsModule,
    AuthModule,
    BarbershopsModule,
    HairstylesModule,
    NotificationsModule,
    UsersModule,
    VisagismModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
