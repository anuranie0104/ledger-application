const express = require('express');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(require('chai-like'));
chai.use(require('chai-things'));
chai.use(chaiHttp);

/**
 * Integration testing for Ledger Application
 */
describe('Ledger Application', () => {
  let app;

  // Start server before running tests
  before((done) => {
    app = express();
    app.listen(4000, (err) => {
      if (err) { return done(err); }
      done();
    });
  });

  context('/POST fetch ledger', () => { // Integration tests for all scenarios of fetching ledger (POST HTTP call)
    it('should give an error message that start_date is missing', (done) => {
      chai.request('http://localhost:3000')
        .post(`/ledger`)
        .set('content-type', 'application/json')
        .send({
          end_date: '2021-05-30T14:48:00.000Z',
          frequency: 'monthly',
          weekly_rent: 555,
          timezone: 'Australia/Perth'
        })
        .end((err, res) => {
          expect(res).to.be.an('object');
          expect(res.status).to.equal(422);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('array').length(3);
          expect(res.body.errors).to.be.an('array').that.contains.something.like({ msg: 'start_date does not exists' });
          expect(res.body.errors).to.be.an('array').that.contains.something.like({ msg: 'start_date has to be an ISO string' });
          expect(res.body.errors).to.be.an('array').that.contains.something.like({ msg: 'start_date is a date after end_date.' });
          done();
        });
    });

    it('should give an error message that end_date is missing', (done) => {
      chai.request('http://localhost:3000')
        .post(`/ledger`)
        .set('content-type', 'application/json')
        .send({
          start_date: '2021-05-30T14:48:00.000Z',
          frequency: 'monthly',
          weekly_rent: 555,
          timezone: 'Australia/Perth'
        })
        .end((err, res) => {
          expect(res).to.be.an('object');
          expect(res.status).to.equal(422);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('array').length(3);
          expect(res.body.errors).to.be.an('array').that.contains.something.like({ msg: 'end_date does not exists' });
          expect(res.body.errors).to.be.an('array').that.contains.something.like({ msg: 'end_date has to be an ISO string' });
          expect(res.body.errors).to.be.an('array').that.contains.something.like({ msg: 'start_date is a date after end_date.' });
          done();
        });
    });

    it('should give an error message that frequency is missing', (done) => {
      chai.request('http://localhost:3000')
        .post(`/ledger`)
        .set('content-type', 'application/json')
        .send({
          start_date: '2021-01-31T14:48:00.000Z',
          end_date: '2021-05-30T14:48:00.000Z',
          weekly_rent: 555,
          timezone: 'Australia/Perth'
        })
        .end((err, res) => {
          expect(res).to.be.an('object');
          expect(res.status).to.equal(422);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('array').length(2);
          expect(res.body.errors).to.be.an('array').that.contains.something.like({ msg: 'frequency does not exists' });
          expect(res.body.errors).to.be.an('array').that.contains.something.like({ msg: `frequency has to 'weekly','fortnightly' or 'monthly'` });
          done();
        });
    });

    it('should give an error message that weekly_rent is missing', (done) => {
      chai.request('http://localhost:3000')
        .post(`/ledger`)
        .set('content-type', 'application/json')
        .send({
          start_date: '2021-01-31T14:48:00.000Z',
          end_date: '2021-05-30T14:48:00.000Z',
          frequency: 'monthly',
          timezone: 'Australia/Perth'
        })
        .end((err, res) => {
          expect(res).to.be.an('object');
          expect(res.status).to.equal(422);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('array').length(2);
          expect(res.body.errors).to.be.an('array').that.contains.something.like({ msg: 'weekly_rent does not exists' });
          expect(res.body.errors).to.be.an('array').that.contains.something.like({ msg: 'weekly_rent has to decimal or integer' });
          done();
        });
    });

    it('should give an error message that start_date is after end_date', (done) => {
      chai.request('http://localhost:3000')
        .post(`/ledger`)
        .set('content-type', 'application/json')
        .send({
          start_date: '2021-05-30T14:48:00.000Z',
          end_date: '2021-01-31T14:48:00.000Z',
          frequency: 'monthly',
          weekly_rent: 555,
          timezone: 'Australia/Perth'
        })
        .end((err, res) => {
          expect(res).to.be.an('object');
          expect(res.status).to.equal(422);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('array').length(1);
          expect(res.body.errors).to.be.an('array').that.contains.something.like({ msg: 'start_date is a date after end_date.' });
          done();
        });
    });

    it('should return ledger successfully even with timezone missing', (done) => {
      chai.request('http://localhost:3000')
        .post(`/ledger`)
        .set('content-type', 'application/json')
        .send({
          start_date: '2021-01-31T14:48:00.000Z',
          end_date: '2021-05-30T14:48:00.000Z',
          frequency: 'monthly',
          weekly_rent: 555
        })
        .end((err, res) => {
          expect(res).to.be.an('object');
          expect(res.status).to.equal(200);
          expect(res.body.ledger).to.be.an('array').length(4);
          done();
        });
    });

    it('should return ledger successfully when all parameters are given', (done) => {
      chai.request('http://localhost:3000')
        .post(`/ledger`)
        .set('content-type', 'application/json')
        .send({
          start_date: '2021-01-31T14:48:00.000Z',
          end_date: '2021-05-30T14:48:00.000Z',
          frequency: 'monthly',
          weekly_rent: 555,
          timezone: 'Australia/Perth'
        })
        .end((err, res) => {
          expect(res).to.be.an('object');
          expect(res.status).to.equal(200);
          expect(res.body.ledger).to.be.an('array').length(4);
          done();
        });
    });
  });
});