import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExerciseEntity } from './entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseFilters } from './interfaces/exercise-filters.interface';

const exerciseSelect = {
  id: true,
  name: true,
  userId: true,
  createdAt: true,
  approaches: true,
} satisfies Prisma.ExerciseSelect;

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async findExercises(filters?: ExerciseFilters): Promise<ExerciseEntity[]> {
    try {
      const exercises = await this.prisma.exercise.findMany({
        where: filters || {},
        select: exerciseSelect,
      });

      return exercises;
    } catch (error) {
      throw new Error('Ошибка при получении списка упражнений');
    }
  }

  async findById(id: string): Promise<ExerciseEntity | null> {
    try {
      const exercise = await this.prisma.exercise.findUnique({
        where: { id },
        select: exerciseSelect,
      });

      return exercise;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Ошибка при поиске упражнения');
    }
  }

  async createExercise(data: CreateExerciseDto): Promise<ExerciseEntity> {
    try {
      const exercise = await this.prisma.exercise.create({
        data: {
          name: data.name,
          userId: data.userId,
        },
        select: exerciseSelect,
      });
      return exercise;
    } catch (error) {
      throw new Error('Ошибка при создании упражнения');
    }
  }

  async updateExercise(id: string, data: UpdateExerciseDto): Promise<ExerciseEntity> {
    try {
      const updatedExercise = await this.prisma.exercise.update({
        where: { id },
        data: {
          name: data.name,
        },
        select: exerciseSelect,
      });

      return updatedExercise;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Ошибка при обновлении упражнения');
    }
  }

  async deleteExercise(id: string): Promise<ExerciseEntity> {
    try {
      const deletedExercise = await this.prisma.exercise.delete({
        where: { id },
        select: exerciseSelect,
      });

      return deletedExercise;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Ошибка при удалении упражнения');
    }
  }
}
