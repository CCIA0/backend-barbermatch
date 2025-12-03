import { Appointment } from './appointment.entity';
import { Barber } from './barber.entity';
import { Barbershop } from './barbershop.entity';
import { FaceAnalysisResult } from './face-analysis-result.entity';
import { Hairstyle } from './hairstyle.entity';
import { UserProfile } from './user-profile.entity';
import { User } from './user.entity';

describe('Entities', () => {
  it('should create an Appointment instance', () => {
    const entity = new Appointment();
    entity.id = 1;
    entity.date = new Date();
    entity.status = 'pending';
    expect(entity).toBeInstanceOf(Appointment);
  });

  it('should create a Barber instance', () => {
    const entity = new Barber();
    entity.id = 1;
    entity.name = 'Test Barber';
    expect(entity).toBeInstanceOf(Barber);
  });

  it('should create a Barbershop instance', () => {
    const entity = new Barbershop();
    entity.id = 1;
    entity.name = 'Test Barbershop';
    entity.address = '123 Main St';
    expect(entity).toBeInstanceOf(Barbershop);
  });

  it('should create a FaceAnalysisResult instance', () => {
    const entity = new FaceAnalysisResult();
    entity.id = 1;
    entity.faceShape = 'oval';
    entity.confidence = 0.9;
    expect(entity).toBeInstanceOf(FaceAnalysisResult);
  });

  it('should create a Hairstyle instance', () => {
    const entity = new Hairstyle();
    entity.id = 1;
    entity.name = 'Test Style';
    entity.recommendedFaceShapes = ['oval'];
    expect(entity).toBeInstanceOf(Hairstyle);
  });

  it('should create a UserProfile instance', () => {
    const entity = new UserProfile();
    entity.id = 1;
    entity.name = 'Test User';
    expect(entity).toBeInstanceOf(UserProfile);
  });

  it('should create a User instance', () => {
    const entity = new User();
    entity.id = 1;
    entity.email = 'test@example.com';
    entity.password = 'password';
    entity.role = 'client';
    expect(entity).toBeInstanceOf(User);
  });
});
