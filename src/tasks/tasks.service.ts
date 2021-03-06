import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDTO: GetTasksFilterDTO): Task[] {
    const { status, search } = filterDTO;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        task =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  getTaskByID(id: string): Task {
    const foundTask = this.tasks.find(task => task.id === id);
    console.log(foundTask);
    if (!foundTask) {
      throw new NotFoundException(`Task with ID: ${id} not found.`);
    }
    return foundTask;
  }

  createTask(createTaskDTO: CreateTaskDTO): Task {
    const { title, description } = createTaskDTO;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  deleteTaskByID(id: string): void {
    const foundTask = this.getTaskByID(id);
    this.tasks = this.tasks.filter(task => task.id !== foundTask.id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.tasks.find(task => task.id === id);
    task.status = status;
    return task;
  }
}
