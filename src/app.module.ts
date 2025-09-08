import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { Appointment } from './entities/appointment.entity';
import { Barbershop } from './entities/barbershop.entity';
import { Barber } from './entities/barber.entity';
import { Hairstyle } from './entities/hairstyle.entity';
import { FaceAnalysisResult } from './entities/face-analysis-result.entity';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
