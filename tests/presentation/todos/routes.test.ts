import { beforeAll, afterAll, beforeEach, describe, test, expect } from "vitest";
import request from 'supertest';
import { testServer } from '../../test-server'
import { prisma } from "../../../src/data/postgres";

describe('todo route testing', () => {

  beforeAll(async () => {
    await testServer.start();
  });

  afterAll(() => {
    testServer.close();
  });

  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });

  const todo1 = { text: 'test mensaje 1' };
  const todo2 = { text: 'test mensaje 2' };

  test('should return TODOs api/todos', async () => {
    // await prisma.todo.deleteMany();
    await prisma.todo.createMany({
      data: [todo1, todo2],
    });

    const { body } = await request(testServer.app)
      .get('/api/todos')
      .expect(200);

    // console.log(body);
    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(2);
    expect(body[0].text).toBe(todo1.text);
    expect(body[1].text).toBe(todo2.text);
    expect(body[0].completedAt).toBeNull();
  });

  test('should return a TODO api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .get(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
      completedAt: todo.completedAt,
    });
  });

  test('should return 404 NotFound api/todos/:id', async () => {
    const todoId = 999;
    const { body } = await request(testServer.app)
      .get(`/api/todos/${todoId}`)
      .expect(404);

    expect(body).toEqual({
      error: `TODO con ID ${todoId} no encontrado`
    });
  });

  test('should return a new TODO api/todos', async () => {
    const { body } = await request(testServer.app)
      .post('/api/todos')
      .send(todo1)
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo1.text,
      completedAt: null,
    });
  });

  test('should return an error if text is not present api/todos', async () => {
    const { body } = await request(testServer.app)
      .post('/api/todos')
      .send({})
      .expect(400);

    expect(body).toEqual({ error: expect.any(String) });
  });

  test('should return an error if text is empty api/todos', async () => {
    const { body } = await request(testServer.app)
      .post('/api/todos')
      .send({ text: '' })
      .expect(400);

    expect(body).toEqual({ error: expect.any(String) });
  });

  test('should return an updated TODO api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ text: 'test mensaje UPDATE', completedAt: '2026-11-16' })
      .expect(200);

    // console.log({ body });
    expect(body).toEqual({
      id: expect.any(Number),
      text: 'test mensaje UPDATE',
      completedAt: '2026-11-16T00:00:00.000Z',
    });
  });

  test('should return 404 if TODO not found api/todos/:id', async () => {
    const { body } = await request(testServer.app)
      .put('/api/todos/999')
      .send({ text: 'test mensaje UPDATE', completedAt: '2026-11-16' })
      .expect(404);

    expect(body).toEqual({ error: expect.any(String) });
  });

  test('should return an updated TODO only the date api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ completedAt: '2026-11-16' })
      .expect(200);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo.text,
      completedAt: '2026-11-16T00:00:00.000Z',
    });
  });

  test('should delete a TODO api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .delete(`/api/todos/${todo.id}`)
      .expect(200);

    // console.log(body);
    expect(body).toEqual({
      id: expect.any(Number),
      text: todo.text,
      completedAt: null,
    });
  });

  test('should return 404 if TODO do not exist api/todos/:id', async () => {
    const { body } = await request(testServer.app)
      .delete('/api/todos/999')
      .expect(404);

    expect(body).toEqual({ error: expect.any(String) });
  });
});