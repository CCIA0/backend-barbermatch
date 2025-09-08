import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Hairstyle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column('simple-array')
  recommendedFaceShapes: string[];
}
