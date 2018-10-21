import request from 'supertest';
import faker from 'faker';
import app from '..';
import db from '../models';
// import { user1, user2, user3 } from './__fixtures__/users';

const user1 = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
};
describe('requests', () => {
  let server;
  beforeEach(() => {
    server = app().listen();
  });
  afterEach((done) => {
    server.close();
    done();
  });


  it('GET 200', async () => {
    const res = await request.agent(server)
      .get('/');
    expect(res.status).toBe(200);
  });

  it('GET 404', async () => {
    const res = await request.agent(server)
      .get('/wrong-path');
    expect(res.status).toBe(404);
  });
});

describe('users', () => {
  let server;
  beforeEach(async () => {
    server = app().listen();
    await db.sequelize.sync({ force: true });
  });
  afterEach((done) => {
    server.close();
    done();
  });

  it('autentification test', async () => {
    console.log(user1);
    const res = await request.agent(server)
      .post('/users')
      .send(user1);
    expect(res.status).toBe(302);
  });
});
