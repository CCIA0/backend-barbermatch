import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class FaceAnalysisResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  faceShape: string;

  @Column({ nullable: true })
  confidence: number;
}
