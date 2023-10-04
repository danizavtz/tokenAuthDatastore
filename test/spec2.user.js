process.env.NODE_ENV = 'test';
const fs = require('fs')
const expect = require('chai').expect;
const sinon = require('sinon');
const supertest = require('supertest');
const app = require('../app');
const { Datastore } = require('@google-cloud/datastore');
const dbinstance = new Datastore({ projectId: process.env.DATASTOREPROJECTID });
app.set('datastore', dbinstance);
app.listen(process.env.PORT);

const api = supertest(app)

describe('#User', () => {
    describe('GET', () => {
        it('Check users route return 200', (done) => {
            const content = fs.readFileSync('./test/mockedresponses/users.json')
            const parsedContent = JSON.parse(content)
            const stub1 = sinon.stub(dbinstance, 'createQuery').returns({});
            const stub2 = sinon.stub(dbinstance, 'runQuery').returns(parsedContent);
            api.get('/users')
                .set('Accept', 'application/json; charset=utf-8')
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    stub1.restore();
                    stub2.restore();
                    expect(res.body[0]).to.be.an('array');
                    expect(res.body[0].length).equal(2);
                    expect(res.body[0][0]).to.have.property('nome');
                    expect(res.body[0][0].nome).equal('eu');
                    done();
                });
        });
        it('Check users return error 500', (done) => {
            const content = fs.readFileSync('./test/mockedresponses/users-500.json');
            const parsedContent = JSON.parse(content)
            const stub1 = sinon.stub(dbinstance, 'createQuery').returns({});
            const stub2 = sinon.stub(dbinstance, 'runQuery').throws(parsedContent);
            api.get('/users')
                .set('Accept', 'application/json; charset=utf-8')
                .expect(500)
                .end((err, res) => {
                    if (err) throw err;
                    stub1.restore();
                    stub2.restore();
                    expect(res.body).to.have.property('errors');
                    expect(res.body.errors).to.be.an('array');
                    done();
                });
        });
        it('Check get by id 404 does not exist', (done) => {
            const chave = {
                namespace: undefined,
                id: 1,
                kind: "Pessoa",
                path: [
                    "Pessoa",
                    1,
                ],
            };
            const stub1 = sinon.stub(dbinstance, 'key').returns(chave);
            const stub2 = sinon.stub(dbinstance, 'get').returns([])
            api.get('/users/0000000000000001')
                .set('Accept', 'application/json; charset=utf-8')
                .expect(404)
                .end((err, res) => {
                    if (err) throw err;
                    stub1.restore();
                    stub2.restore();
                    expect(res.body).to.have.property('errors');
                    expect(res.body.errors).to.be.an('array');
                    done();
                });
        });
        it('Check get by id with success', (done) => {
            const content = fs.readFileSync('./test/mockedresponses/user-byid.json')
            const parsedContent = JSON.parse(content)
            const stub = sinon.stub(dbinstance, 'get').returns(parsedContent)
            api.get('/users/0000000000000001')
                .set('Accept', 'application/json; charset=utf-8')
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    stub.restore();
                    expect(res.body).to.be.an('array');
                    expect(res.body[0]).to.have.property('name')
                    expect(res.body[0].name).equal('eu')
                    expect(res.body[0]).to.have.property('login')
                    expect(res.body[0].login).equal('admin')
                    expect(res.body[0]).to.have.property('password')
                    expect(res.body[0].password).equal('1lkajdhsa0987')
                    done();
                });
        });
        it('Check get by id error 500 with success', (done) => {
            const content = fs.readFileSync('./test/mockedresponses/users-500.json')
            const parsedContent = JSON.parse(content)
            const stub = sinon.stub(dbinstance, 'get').throws(parsedContent)
            api.get('/users/0000000000000001')
                .set('Accept', 'application/json; charset=utf-8')
                .expect(500)
                .end((err, res) => {
                    if (err) throw err;
                    stub.restore();
                    expect(res.body).to.have.property("errors");
                    expect(res.body.errors).to.be.an("array");
                    expect(res.body.errors[0]).to.have.property('msg');
                    expect(res.body.errors[0].msg).equal('mocked error');
                    done();
                });
        });
    });
    describe('POST', () => {
        it('Check post user validation error', (done) => {
            api.post('/users')
                .set('Accept', 'application/json; charset=utf-8')
                .send({})
                .expect(400)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body).to.have.property("errors");
                    expect(res.body.errors).to.be.an("array");
                    expect(res.body.errors[0]).to.have.property("msg");
                    expect(res.body.errors[0].msg).equal("name is required");
                    expect(res.body.errors[1]).to.have.property("msg");
                    expect(res.body.errors[1].msg).equal("login is required");
                    expect(res.body.errors[2]).to.have.property("msg");
                    expect(res.body.errors[2].msg).equal("password is required");
                    expect(res.body.errors[3]).to.have.property("msg");
                    expect(res.body.errors[3].msg).equal("name is required");
                    expect(res.body.errors[4]).to.have.property("msg");
                    expect(res.body.errors[4].msg).equal("login is required");
                    expect(res.body.errors[5]).to.have.property("msg");
                    expect(res.body.errors[5].msg).equal("password is required");
                    done()
                });
        });
        it('Check post user with success', (done) => {
            const content = fs.readFileSync('./test/mockedresponses/user-post.json');
            const parsedContent = JSON.parse(content);
            const stub = sinon.stub(dbinstance, 'save').returns(parsedContent)
            api.post('/users')
                .set('Accept', 'application/json; charset=utf-8')
                .send(parsedContent)
                .expect(201)
                .end((err, res) => {
                    if (err) throw err;
                    stub.restore();
                    expect(res.status).equal(201)
                    done()
                });
        });
        it('Check post error 500 with success', (done) => {
            const content = fs.readFileSync('./test/mockedresponses/users-500.json')
            const parsedContent = JSON.parse(content)
            const usuario = fs.readFileSync('./test/mockedresponses/user-post.json');
            const parsedUsuario = JSON.parse(usuario);
            const stub = sinon.stub(dbinstance, 'save').throws(parsedContent)
            api.post('/users')
                .set('Accept', 'application/json; charset=utf-8')
                .send(parsedUsuario)
                .expect(500)
                .end((err, res) => {
                    if (err) throw err;
                    stub.restore();
                    expect(res.body).to.have.property("errors");
                    expect(res.body.errors).to.be.an("array");
                    expect(res.body.errors[0]).to.have.property('msg');
                    expect(res.body.errors[0].msg).equal('mocked error');
                    done();
                });
        });
    });
    describe('PUT', () => {
        it('Check update user with success', (done) => {
            const chave = {
                namespace: undefined,
                id: 1,
                kind: "Pessoa",
                path: [
                    "Pessoa",
                    1,
                ],
            };
            const content = fs.readFileSync('./test/mockedresponses/user-post.json')
            const parsedContent = JSON.parse(content)
            const stub1 = sinon.stub(dbinstance, 'key').returns(chave);
            const stub2 = sinon.stub(dbinstance, 'get').returns(parsedContent);
            const stub3 = sinon.stub(dbinstance, 'save').returns([])
            api.put('/users/0000000000000001')
                .set('Accept', 'application/json; charset=utf-8')
                .send(parsedContent)
                .expect(204)
                .end((err, res) => {
                    if (err) throw err;
                    stub1.restore();
                    stub2.restore();
                    stub3.restore();
                    expect(res.status).equal(204);
                    done();
                })
        });
        it('Check delete user with error 500', (done) => {
            const chave = {
                namespace: undefined,
                id: 1,
                kind: "Pessoa",
                path: [
                    "Pessoa",
                    1,
                ],
            };
            const content = fs.readFileSync('./test/mockedresponses/user-post.json');
            const parsedContent = JSON.parse(content);
            const errorContent = fs.readFileSync('./test/mockedresponses/users-500.json')
            const parsedErrorContent = JSON.parse(errorContent)
            const stub1 = sinon.stub(dbinstance, 'key').returns(chave);
            const stub2 = sinon.stub(dbinstance, 'get').returns(parsedContent)
            const stub3 = sinon.stub(dbinstance, 'save').throws(parsedErrorContent)
            api.put('/users/0000000000000001')
                .set('Accept', 'application/json; charset=utf-8')
                .send(parsedContent)
                .expect(500)
                .end((err, res) => {
                    if (err) throw err;
                    stub1.restore();
                    stub2.restore();
                    stub3.restore();
                    expect(res.body).to.have.property("errors");
                    expect(res.body.errors).to.be.an("array");
                    expect(res.body.errors[0]).to.have.property('msg');
                    expect(res.body.errors[0].msg).equal('mocked error');
                    done();
                });
        });
    });
    describe('DELETE', () => {
        it('Check delete user with success', (done) => {
            const chave = {
                namespace: undefined,
                id: 1,
                kind: "Pessoa",
                path: [
                    "Pessoa",
                    1,
                ],
            };
            const stub1 = sinon.stub(dbinstance, 'key').returns(chave);
            const stub2 = sinon.stub(dbinstance, 'delete').returns([])
            api.delete('/users/0000000000000001')
                .set('Accept', 'application/json; charset=utf-8')
                .expect(204)
                .end((err, res) => {
                    if (err) throw err;
                    stub1.restore();
                    stub2.restore();
                    expect(res.status).equal(204);
                    done();
                })
        });
        it('Check delete user with error 500', (done) => {
            const chave = {
                namespace: undefined,
                id: 1,
                kind: "Pessoa",
                path: [
                    "Pessoa",
                    1,
                ],
            };
            const content = fs.readFileSync('./test/mockedresponses/users-500.json')
            const parsedContent = JSON.parse(content)
            const stub1 = sinon.stub(dbinstance, 'key').returns(chave);
            const stub2 = sinon.stub(dbinstance, 'delete').throws(parsedContent);
            api.delete('/users/0000000000000001')
                .set('Accept', 'application/json; charset=utf-8')
                .expect(500)
                .end((err, res) => {
                    if (err) throw err;
                    stub1.restore();
                    stub2.restore();
                    expect(res.body).to.have.property("errors");
                    expect(res.body.errors).to.be.an("array");
                    expect(res.body.errors[0]).to.have.property('msg');
                    expect(res.body.errors[0].msg).equal('mocked error');
                    done();
                });
        });
    });
});