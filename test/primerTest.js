const supertest = require('supertest');
const { TestWatcher } = require('@jest/core')
const Server = require('./models/Server');


const api = supertest(Server);

test('primero', () => {
    const api = Server.conectarDB();

    expect(api).toBe(true);
})