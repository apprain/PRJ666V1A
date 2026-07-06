import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Task } from './task.entity';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  getAllTasks() {
    return this.taskRepository.find();
  }

  getTaskById(id: number) {
    return this.taskRepository.findOneBy({ id });
  }

  async updateTaskStatus(id: number, status: string) {

    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      return { message: 'Task not found' };
    }

    task.status = status;

    return await this.taskRepository.save(task);
  }

  async createTask(title: string) {

    const task = this.taskRepository.create({
      title,
      status: 'pending',
    });

    return await this.taskRepository.save(task);
  }

  async deleteTask(id: number) {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      return { message: 'Task not found' };
    }

    await this.taskRepository.remove(task);

    return { message: 'Task deleted successfully' };
  }


}