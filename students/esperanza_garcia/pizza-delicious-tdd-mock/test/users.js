'use strict'

const faker = require('faker')
const md5 = require('md5')

let app = require('../app.js')

const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

chai.use(chaiHttp)

let newItemRef = null
let editedItemRef = null

describe('users', () => {
  describe('LIST', () => {

    it('Should return status 200 and json as default data format', (done) => {

      chai.request(app)
        .get('/users')
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
        .post('/users')
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
          expect(res.body).to.have.property('firstname').to.be.equal(newItemRef.firstname)
          expect(res.body).to.have.property('lastname').to.be.equal(newItemRef.lastname)
          expect(res.body).to.have.property('email').to.be.equal(newItemRef.email)
          expect(res.body).to.not.have.property('password')
          expect(res.body).to.have.property('address').to.be.equal(newItemRef.address)
          expect(res.body).to.have.property('phone').to.be.equal(newItemRef.phone)
          expect(res.body).to.have.property('profile').to.be.equal(newItemRef.profile)
          expect(res.body).to.have.property('enabled').to.be.equal(newItemRef.enabled)

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
        .get('/users/'+newItemRef.id)
        .end((err, res) => {

          if (err) {
            console.error(err)
            done()
          }

          expect(res).to.have.status(200)
          expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
          expect(res.body).to.have.property('id').to.be.equal(newItemRef.id)
          expect(res.body).to.have.property('firstname').to.be.equal(newItemRef.firstname)
          expect(res.body).to.have.property('lastname').to.be.equal(newItemRef.lastname)
          expect(res.body).to.have.property('email').to.be.equal(newItemRef.email)
          expect(res.body).to.not.have.property('password')
          expect(res.body).to.have.property('address').to.be.equal(newItemRef.address)
          expect(res.body).to.have.property('phone').to.be.equal(newItemRef.phone)
          expect(res.body).to.have.property('profile').to.be.equal(newItemRef.profile)
          expect(res.body).to.have.property('enabled').to.be.equal(newItemRef.enabled)

          done()
        })
    })
  })

  describe('PUT', () => {
    it('Should return status 200 and json as default data format', (done) => {

      editedItemRef = modifyItem(newItemRef)

      chai.request(app)
        .put('/users/' + newItemRef.id)
        .send(editedItemRef)
        .end((err, res) => {

          if (err) {
            console.error(err)
            done()
          }

          expect(res).to.have.status(200)
          expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
          expect(res.body).to.have.property('id').to.be.equal(newItemRef.id)
          expect(res.body).to.have.property('firstname').to.be.equal(newItemRef.firstname)
          expect(res.body).to.have.property('lastname').to.be.equal(newItemRef.lastname)
          expect(res.body).to.have.property('email').to.be.equal(newItemRef.email)
          expect(res.body).to.not.have.property('password')
          expect(res.body).to.have.property('address').to.be.equal(newItemRef.address)
          expect(res.body).to.have.property('phone').to.be.equal(newItemRef.phone)
          expect(res.body).to.have.property('profile').to.be.equal(newItemRef.profile)
          expect(res.body).to.have.property('enabled').to.be.equal(newItemRef.enabled)

          done()
        })
    })
  })


  describe('DELETE', () => {
    it('Should return status 200 and json as default data format', function (done) {

      chai.request(app)
        .delete('/users/' + newItemRef.id)
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

  let gender = faker.random.boolean()

  return {
    'firstname': faker.name.firstName(gender),
    'lastname': faker.name.lastName(gender),
    'email': faker.internet.email(),
    'password': 'test',
    'address': faker.address.streetAddress(true),
    'phone': faker.phone.phoneNumber(),
    'profile': faker.random.arrayElement(['user','admin']),
    'enabled': true
  }
}

function modifyItem(item) {
  item.enabled = faker.random.boolean()
  item.profile = faker.random.arrayElement(['user','admin'])
  item.password = faker.internet.password(8)
  item.address = faker.address.streetAddress(true)
  item.phone = faker.phone.phoneNumber()

  return item
}
