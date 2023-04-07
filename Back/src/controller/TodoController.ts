import {
  JsonController,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Req,
  UseBefore,
  Patch,
  Res,
} from "routing-controllers";
import { AppDataSource } from "../db/data-source";
import { Authentification } from "../middleware/auth";
import { GetUserTask } from "../repository/TodoRepository";
import { User } from "../entity/User";
import { Todo } from "../entity/Todo";
import * as jwt from "jsonwebtoken";
import { Response } from "express";

@JsonController()
export class TodoController {
  constructor(public todoRepository, public userRepository) {
    this.todoRepository = AppDataSource.getRepository(Todo);
    this.userRepository = AppDataSource.getRepository(User);
  }

  @Post("/todo/:id")
  public async createTask(@Body() data: Todo, @Param("id") id: Number) {
    try {
      const user: User = await this.userRepository.findOne({
        where: { id: id },
      });
      const todo: Todo = data;

      todo.setStatus(0);
      todo.setUser(user);

      await this.todoRepository.save(todo);
      return { success: "Task created" };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get("/todo/:id")
  public async getAllTodo(@Param("id") id: Number, @Res() res: Response) {
    try {
      const todo: Todo = await this.todoRepository.find({
        relations: ["user"],
        where: { user: { id: id } },
      });
      if (todo[0] == undefined) {
        return res.status(400).json({ error: "no task found" });
      } else {
        return { task: todo };
      }
    } catch (err) {
      return { error: err.message };
    }
  }

  @Get("/todo/check/:id")
  public async checkTodo(@Param("id") id: string, @Req() req: any) {
    try {
      const todo: Todo = await this.todoRepository.findOne({
        where: { id: id },
      });
      if (todo.getStatus() == 0) {
        todo.setStatus(1);
      } else {
        todo.setStatus(0);
      }
      await this.todoRepository.save(todo);
      return { success: "Task clear" };
    } catch (err) {
      return { error: err.message };
    }
  }

  @Put("/todo/:id")
  public async updateTodo(@Body() data: Todo, @Param("id") id: string) {
    try {
      const todo: Todo = await this.todoRepository.findOne({
        where: { id: id },
      });
      if (!todo) throw new Error("Task not found");

      //Reupload datas in db
      await this.todoRepository.save({ ...todo, ...data });
      return { success: "task updated" };
    } catch (err) {
      return { error: err.message };
    }
  }

  @Delete("/todo/:id")
  public async deleteTodo(@Param("id") id: string, @Req() req: any) {
    try {
      const todo: Todo = await this.todoRepository.findOne({
        where: { id: id },
      });
      await this.todoRepository.remove(todo);
      return { success: "Task deleted" };
    } catch (err) {
      return { error: err.message };
    }
  }
}
