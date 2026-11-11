import { Request, Response } from "express";

const todos = [
  { id: 1, text: 'mensaje 1', completedAt: new Date() },
  { id: 2, text: 'mensaje 2', completedAt: new Date() },
  { id: 3, text: 'mensaje 3', completedAt: null },
];

export class TodosController {

  //* DI
  constructor() { }

  public getTodos = (req: Request, res: Response) => {
    res.json(todos);
    return;
  }

  public getTodoById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'argumento ID no es un número' });
      return;
    }

    const todo = todos.find(todo => todo.id === id);

    (todo)
      ? res.json(todo)
      : res.json({ error: `TODO con ID ${id} no encontrado` })
  }

  public createTodo = (req: Request, res: Response) => {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ error: 'propiedad <text> es obligatoria' });
      return;
    }

    const newTodo = {
      id: todos.length + 1,
      text: text,
      completedAt: new Date(),
    };

    todos.push(newTodo)
    res.json(newTodo);
  }

  public updateTodo = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'argumento ID no es un número' });
      return;
    }

    const todo = todos.find(todo => todo.id === id);
    if (!todo) {
      res.status(404).json({ error: `TODO con ID ${id} no encontrado` });
      return;
    }

    const { text, completedAt } = req.body;

    todo.text = text || todo.text;
    (completedAt === 'null')
      ? todo.completedAt = null
      : todo.completedAt = new Date(completedAt || todo.completedAt);


    res.json(todo);
  }

  public deleteTodo = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'argumento ID no es un número' });
      return;
    }

    const todo = todos.find(todo => todo.id === id);
    if (!todo) {
      res.status(404).json({ error: `TODO con ID ${id} no encontrado` });
      return;
    }

    todos.splice(todos.indexOf(todo), 1);
    res.json(todo);
  }
}
