import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        const isProduction = configService.get('NODE_ENV') === 'production';
        
        if (databaseUrl) {
          // Configuración para producción con DATABASE_URL
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [
              User,
              UserProfile,
              Appointment,
              Barbershop,
              Barber,
              Hairstyle,
              FaceAnalysisResult,
            ],
            synchronize: !isProduction,
            ssl: isProduction ? { rejectUnauthorized: false } : false,
          };
        } else {
          // Configuración para desarrollo
          return {
            type: 'postgres',
            host: configService.get('DB_HOST', 'localhost'),
            port: configService.get('DB_PORT', 5432),
            username: configService.get('DB_USERNAME', 'barbermatch_user'),
            password: configService.get('DB_PASSWORD', 'barber123'),
            database: configService.get('DB_NAME', 'barber_db'),
            entities: [
              User,
              UserProfile,
              Appointment,
              Barbershop,
              Barber,
              Hairstyle,
              FaceAnalysisResult,
            ],
            synchronize: !isProduction,
          };
        }
      },
      inject: [ConfigService],
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
