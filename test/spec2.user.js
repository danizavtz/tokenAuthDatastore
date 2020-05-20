process.env.NODE_ENV = 'test';
const fs = require('fs')
const nock = require('nock')
const expect = require('chai').expect;
const axios = require('axios');
const apilocal = axios.create({
    baseURL: `http://127.0.0.1:${process.env.PORT}/`
})
const fakeDatastore = {
    createQuery: function (a) { },
    runQuery: function (a) { }
}
const app = require('../app');
app.set('datastore', fakeDatastore);
app.listen(process.env.PORT);

describe('#User', () => {
    describe('GET', () => {
        it('Check users route return 200', (done) => {
            const content = fs.readFileSync('./test/mockedresponses/users.json')
            const parsedContent = JSON.parse(content)
            nock(`http://127.0.0.1:${process.env.PORT}/`)
                .get('/users')
                .reply(200, parsedContent)
            apilocal.get('/users')
                .then(response => {
                    expect(response.data).to.be.an('array')
                    done()
                }).catch((error) => {
                    throw error
                })
        })
        it('Check users return error 500', (done) => {
            const content = fs.readFileSync('./test/mockedresponses/users-500.json')
            const parsedContent = JSON.parse(content)

            nock(`http://127.0.0.1:${process.env.PORT}/`)
                .get('/users')
                .replyWithError({
                    status: 500,
                    body: parsedContent
                })
            apilocal.get('/users')
                .then(response => {
                    console.log('should not print it')
                    // done()
                }).catch((response) => {
                    expect(response.status).equal(500)
                    expect(response.body).to.have.property('errors')
                    expect(response.body.errors).to.be.an('array')
                    expect(response.body.errors[0]).to.have.property('msg')
                    expect(response.body.errors[0].msg).equal('Could not load the default credentials. Browse to https://cloud.google.com/docs/authentication/getting-started for more information.')
                    done()
                })
        })
        it('Check get by id 404 does not exist', (done) => {
            const content = fs.readFileSync('./test/mockedresponses/users-404.json')
            const parsedContent = JSON.parse(content)
            nock(`http://127.0.0.1:${process.env.PORT}/`)
                .get('/users/0000000000000001')
                .replyWithError({
                    status: 404,
                    body: parsedContent
                })
            apilocal.get('/users/0000000000000001')
                .then(res => {
                    //non action needed
                }).catch((response) => {
                    expect(response.status).equal(404)
                    expect(response.body).to.have.property('errors')
                    expect(response.body.errors).to.be.an('array')
                    expect(response.body.errors[0]).to.have.property('msg')
                    expect(response.body.errors[0].msg).equal('Not found')
                    done()
                })
        })
        it('Check get by id with success', (done) => {
            const content = fs.readFileSync('./test/mockedresponses/user-byid.json')
            const parsedContent = JSON.parse(content)
            nock(`http://127.0.0.1:${process.env.PORT}/`)
                .get('/users/5634161670881280')
                .reply(200, parsedContent)
            apilocal.get('/users/5634161670881280')
                .then(res => {
                    expect(res.data[0]).to.have.property('name')
                    expect(res.data[0].name).equal('eu')
                    expect(res.data[0]).to.have.property('login')
                    expect(res.data[0].login).equal('admin')
                    expect(res.data[0]).to.have.property('password')
                    expect(res.data[0].password).equal('1lkajdhsa0987')
                    done()
                }).catch((response) => {
                    throw response
                })
        })
    })
    describe('POST', () => {
        it('Check post validation key name exists', (done) => {
            const content = fs.readFileSync('./test/mockedresponses/user-byid.json')
            nock(`http://127.0.0.1:${process.env.PORT}/`)
                .post('/users')
                .reply(201)
            apilocal.post('/users')
                .then(res => {
                    expect(res.status).equal(201)
                    done()
                })
        })
    })
})