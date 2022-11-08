import {
  afterEach, beforeEach, describe, expect, it, test, jest,
} from '@jest/globals';
import request from 'supertest';
import app from '../../app';

let server;
beforeEach(() => {
  const port = 3000;
  server = app.listen(port);
});

afterEach(() => {
  server.close();
});

describe('GET em / editoras', () => {
  it('Deve retornar uma lista de editoras', async () => {
    const result = await request(app)
      .get('/editoras')
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);
    expect(result.body[0].email).toEqual('e@e.com');
  });
});

let idResposta;
describe('POST em /editoras/id', () => {
  it('Deve adicionar uma nova editoras', async () => {
    const result = await request(app)
      .post('/editoras')
      .send({
        nome: 'CDC',
        cidade: 'Sao Paulo',
        email: 'c@c.com',
      })
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(201);
    idResposta = result.body.content.id;
  });
  it('Deve não adicionar nada ao passar o body vazio', async () => {
    const result = await request(app)
      .post('/editoras')
      .send({})
      .expect(400);
  });
});

describe('GET em /editoras/id', () => {
  it('Deve retornar a editora', async () => {
    await request(app)
      .get(`/editoras/${idResposta}`)
      .expect(200);
  });
});

describe('PUT em /editoras/id', () => {
  test.each([
    ['nome', { nome: 'Casa do Código' }],
    ['cidade', { cidade: 'SP' }],
    ['email', { email: 'cdc@cdc@com' }],
  ])('Deve editar o campo %s de editora', async (chave, param) => {
    const requisicao = { request };
    const spy = jest.spyOn(requisicao, 'request');
    await requisicao.request(app)
      .put(`/editoras/${idResposta}`)
      .send(param)
      .expect(204);
    expect(spy).toHaveBeenCalled();
  });
});

describe('DELETE em /editoras/id', () => {
  it('Deve deletar a editora', async () => {
    await request(app)
      .delete(`/editoras/${idResposta}`)
      .expect(200);
  });
});
