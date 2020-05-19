process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const supertest = require('supertest');
const app = require('../app');
      app.listen();
const api = supertest(app)


describe('#Index', () => {
    describe('GET', () => {
        it('Check fallback route exist', (done) => {
            api.get('/test')
            .set('Accept', 'application/json; charset=utf-8')
            .expect(404)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body).to.have.property('errors')
                expect(res.body.errors).to.be.an('array')
                expect(res.body.errors[0].msg).equal('Not found')
                done()
            })
        })
        it('Check index route is defined', (done) => {
            api.get('/')
            .set('Accept', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body).to.have.property('msg')
                expect(res.body.msg).equal('Server up and running')
                done()
            })
        })
        it('Check not authorized route', (done) => {
            api.get('/secure')
            .set('Accept', 'application/json; charset=utf-8')
            .expect(401)
            .end((err, res) => {
                if (err) throw err;                
                expect(res.status).equal(401)
                done()
            })
        })
    })
})