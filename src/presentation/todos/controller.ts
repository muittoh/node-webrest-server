import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto } from "../../domain/dtos/todos/create-todo.dto";
import { UpdateTodoDto } from "../../domain/dtos";
import { TodoRepository } from "../../domain";

export class TodosController {

  //* DI
  constructor(
    private readonly todoRepository: TodoRepository,
  ) { }

  public getTodos = async (req: Request, res: Response) => {
    const todos = await this.todoRepository.getAll();
    res.json(todos);
    return;
  }

  public getTodoById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    try {
      const todo = await this.todoRepository.findById(id);
      res.json(todo);

    } catch (err) {
      res.status(400).json({ err });
    }
  }

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.from(req.body ?? {});
    if (error) return res.status(400).json({ error });

    const todo = await this.todoRepository.create(req.body);
    res.json(todo);
  }

  public updateTodo = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const [error, updateTodoDto] = UpdateTodoDto.from({ ...req.body, id });
    if (error) {
      res.status(400).json({ error });
      return;
    }

    const updatedTodo = await this.todoRepository.updateById(updateTodoDto!);
    res.json(updatedTodo);
  }

  public deleteTodo = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const deletedTodo = await this.todoRepository.deleteById(id);
    return res.json(deletedTodo);
  }
}
