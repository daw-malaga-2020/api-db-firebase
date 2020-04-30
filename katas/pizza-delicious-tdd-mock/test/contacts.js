'use strict'

const faker = require('faker')

let app = require('../app.js')

const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

chai.use(chaiHttp)

let newItemRef = null

describe('contacts', () => {
  describe('LIST', () => {

    it('Should return status 200 and json as default data format', (done) => {

      chai.request(app)
        .get('/contacts')
        .end((err, res) => {

          //1. comprobamos
          expect(res).to.have.status(200)
          expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
          expect(res.body).to.be.an('array')

          //2. marcamos como finalizado el test
          done()
        })

    })


  })

  describe('POST', () => {

    it('Should return status 201 and json as default data format', (done) => {

      newItemRef = createNewItem()

      chai.request(app)
        .post('/contacts')
        .send(newItemRef)
        .end((err, res) => {

          if (err) {
            console.error(err)
            done()
          }

          //1. comprobamos la respuesta
          expect(res).to.have.status(201)
          expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
          expect(res.body).to.have.property('id').to.be.greaterThan(0)
          expect(res.body).to.have.property('full_name').to.be.equal(newItemRef.full_name)
          expect(res.body).to.have.property('email').to.be.equal(newItemRef.email)
          expect(res.body).to.have.property('subject').to.be.equal(newItemRef.subject)
          expect(res.body).to.have.property('message').to.be.equal(newItemRef.message)
          expect(res.body).to.have.property('dated_at')

          //2. guardamos el resultado para siguientes test
          newItemRef = res.body

          //2. marcamos como finalizado el test
          done()
        })

    })


  })

  describe('GET', () => {
    it('Should return status 200 and json as default data format', (done) => {

      chai.request(app)
        .get('/contacts/'+newItemRef.id)
        .end((err, res) => {

          if (err) {
            console.error(err)
            done()
          }

          expect(res).to.have.status(200)
          expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
          expect(res.body).to.have.property('id').to.be.equal(newItemRef.id)
          expect(res.body).to.have.property('full_name').to.be.equal(newItemRef.full_name)
          expect(res.body).to.have.property('email').to.be.equal(newItemRef.email)
          expect(res.body).to.have.property('subject').to.be.equal(newItemRef.subject)
          expect(res.body).to.have.property('message').to.be.equal(newItemRef.message)
          expect(res.body).to.have.property('dated_at')

          done()
        })
    })
  })


  describe('DELETE', () => {
    it('Should return status 200 and json as default data format', function (done) {

      chai.request(app)
        .delete('/contacts/' + newItemRef.id)
        .end((err, res) => {

          if (err) {
            console.error(err)
            done()
          }

          expect(res).to.have.status(204)
          expect(res.body).to.be.empty

          done()
        })
    })
  })
})

function createNewItem() {

  return {
    'full_name': faker.name.firstName(),
    'email': faker.internet.email(),
    'subject': faker.lorem.sentences(2),
    'message': faker.lorem.paragraphs(2),
    'dated_at': faker.date.recent()
  }
}
