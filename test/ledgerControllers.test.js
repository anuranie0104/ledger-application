const chai = require('chai');
const expect = chai.expect;
const { ledgerWeeklyCalculation, ledgerMonthlyCalculation } = require('../controllers/ledgerControllers');

chai.use(require('chai-like'));
chai.use(require('chai-things'));

/**
 * Unit testing for individual functions in ledgerControllers.
 */
describe('Function to calculate and return ledger with records for each rent frequency', () => {
  context('Ledger for weekly rent frequency', () => { // Weekly rent frequency unit tests
    it('should return the ledger (array of objects) with records all of which have the same amount', () => {
      const output = ledgerWeeklyCalculation('2021-06-01T14:48:00.000Z', '2021-06-28T14:48:00.000Z', 'weekly', 555);
      expect(output).to.be.an('array');
      output.forEach((eachResult) => { // All object must have the following properties
        expect(eachResult).to.have.property('amount');
        expect(eachResult).to.have.property('start_date');
        expect(eachResult).to.have.property('end_date');
        expect(eachResult.amount).to.equal(555); // Amount in all objects must be 555
      });
      expect(output).to.be.an('array').length(4);
    });

    it('should return the ledger (array of objects) with records which have objects with two different amounts  (short of a week by days)', () => {
      const output = ledgerWeeklyCalculation('2021-06-01T14:48:00.000Z', '2021-06-30T14:48:00.000Z', 'weekly', 555);
      expect(output).to.be.an('array');
      output.forEach((eachResult) => { // All object must have the following properties
        expect(eachResult).to.have.property('amount');
        expect(eachResult).to.have.property('start_date');
        expect(eachResult).to.have.property('end_date');
      });
      expect(output).to.be.an('array').length(5);
      expect(output).to.be.an('array').that.contains.something.like({ amount: 555 });
      expect(output).to.be.an('array').that.contains.something.like({ amount: 158.57 });
    });
  });

  context('Ledger for fortnightly rent frequency', () => { // Fortnightly rent frequency unit tests
    it('should return the ledger (array of objects) with records all of which have the same amount', () => {
      const output = ledgerWeeklyCalculation('2021-06-01T14:48:00.000Z', '2021-06-28T14:48:00.000Z', 'fortnightly', 555);
      expect(output).to.be.an('array');
      output.forEach((eachResult) => { // All object must have the following properties
        expect(eachResult).to.have.property('amount');
        expect(eachResult).to.have.property('start_date');
        expect(eachResult).to.have.property('end_date');
        expect(eachResult.amount).to.equal(555 * 2); // Amount in all objects must be 1110
      });
      expect(output).to.be.an('array').length(2);
    });

    it('should return the ledger (array of objects) with records which have objects with two different amounts (short of a fortnight by days)', () => {
      const output = ledgerWeeklyCalculation('2021-06-01T14:48:00.000Z', '2021-06-30T14:48:00.000Z', 'fortnightly', 555);
      expect(output).to.be.an('array');
      output.forEach((eachResult) => { // All object must have the following properties
        expect(eachResult).to.have.property('amount');
        expect(eachResult).to.have.property('start_date');
        expect(eachResult).to.have.property('end_date');
      });
      expect(output).to.be.an('array').length(3);
      expect(output).to.be.an('array').that.contains.something.like({ amount: 555 * 2 });
      expect(output).to.be.an('array').that.contains.something.like({ amount: 158.57 });
    });

    it('should return the ledger (array of objects) with records which have objects with two different amounts (short of a fortnight by a week)', () => {
      const output = ledgerWeeklyCalculation('2021-06-01T14:48:00.000Z', '2021-06-21T14:48:00.000Z', 'fortnightly', 555);
      expect(output).to.be.an('array');
      output.forEach((eachResult) => { // All object must have the following properties
        expect(eachResult).to.have.property('amount');
        expect(eachResult).to.have.property('start_date');
        expect(eachResult).to.have.property('end_date');
      });
      expect(output).to.be.an('array').length(2);
      expect(output).to.be.an('array').that.contains.something.like({ amount: 555 * 2 });
      expect(output).to.be.an('array').that.contains.something.like({ amount: 555 });
    });
  });

  context('Ledger for monthly rent frequency', () => { // Monthly rent frequency unit tests
    it('should return the ledger (array of objects) with records all of which have the same amount', () => {
      const output = ledgerMonthlyCalculation('2021-05-01T14:48:00.000Z', '2021-08-31T14:48:00.000Z', 555);
      expect(output).to.be.an('array');
      output.forEach((eachResult) => { // All object must have the following properties
        expect(eachResult).to.have.property('amount');
        expect(eachResult).to.have.property('start_date');
        expect(eachResult).to.have.property('end_date');
        expect(eachResult.amount).to.equal(2411.61); // Amount in all objects must be 2411.61
      });
      expect(output).to.be.an('array').length(4);
    });

    it('should return the ledger (array of objects) with records which have objects with two different amounts (short of a month by days)', () => {
      const output = ledgerMonthlyCalculation('2021-05-01T14:48:00.000Z', '2021-09-16T14:48:00.000Z', 555);
      expect(output).to.be.an('array');
      output.forEach((eachResult) => { // All object must have the following properties
        expect(eachResult).to.have.property('amount');
        expect(eachResult).to.have.property('start_date');
        expect(eachResult).to.have.property('end_date');
      });
      expect(output).to.be.an('array').length(5);
      expect(output).to.be.an('array').that.contains.something.like({ amount: 2411.61 });
      expect(output).to.be.an('array').that.contains.something.like({ amount: 1268.57 });
    });

    it('should return the ledger (array of objects) with start dates on the same date of every month', () => {
      const output = ledgerMonthlyCalculation('2021-01-15T14:48:00.000Z', '2021-05-30T14:48:00.000Z', 555);
      expect(output).to.be.an('array');
      output.forEach((eachResult) => { // All object must have the following properties
        expect(eachResult).to.have.property('amount');
        expect(eachResult).to.have.property('start_date');
        expect(eachResult).to.have.property('end_date');
      });
      expect(output).to.be.an('array').length(5);
      // The following lines of code ensure that the start date remains the same in every month
      expect(output).to.be.an('array').that.contains.something.like({ start_date: '2021-02-15T14:48:00.000Z' });
      expect(output).to.be.an('array').that.contains.something.like({ start_date: '2021-03-15T14:48:00.000Z' });
      expect(output).to.be.an('array').that.contains.something.like({ start_date: '2021-04-15T14:48:00.000Z' });
    });

    it('should return the ledger (array of objects) with start dates varying based on the number of days of the month (not a leap year)', () => {
      const output = ledgerMonthlyCalculation('2021-01-31T14:48:00.000Z', '2021-05-30T14:48:00.000Z', 555);
      expect(output).to.be.an('array');
      output.forEach((eachResult) => { // All object must have the following properties
        expect(eachResult).to.have.property('amount');
        expect(eachResult).to.have.property('start_date');
        expect(eachResult).to.have.property('end_date');
      });
      expect(output).to.be.an('array').length(4);
      // The following lines of code ensure that the start date varies from month to month depending on the total days of the month
      expect(output).to.be.an('array').that.contains.something.like({ start_date: '2021-02-28T14:48:00.000Z' }); // Non-leap year February last date
      expect(output).to.be.an('array').that.contains.something.like({ start_date: '2021-03-31T14:48:00.000Z' });
      expect(output).to.be.an('array').that.contains.something.like({ start_date: '2021-04-30T14:48:00.000Z' });
    });

    it('should return the ledger (array of objects) with start dates varying based on the number of days of the month (leap year)', () => {
      const output = ledgerMonthlyCalculation('2020-01-31T14:48:00.000Z', '2020-05-30T14:48:00.000Z', 555);
      expect(output).to.be.an('array');
      output.forEach((eachResult) => {
        expect(eachResult).to.have.property('amount');
        expect(eachResult).to.have.property('start_date');
        expect(eachResult).to.have.property('end_date');
      });
      expect(output).to.be.an('array').length(4);
      // The following lines of code ensure that the start date varies from month to month depending on the total days of the month
      expect(output).to.be.an('array').that.contains.something.like({ start_date: '2020-02-29T14:48:00.000Z' }); // Leap year February last date
      expect(output).to.be.an('array').that.contains.something.like({ start_date: '2020-03-31T14:48:00.000Z' });
      expect(output).to.be.an('array').that.contains.something.like({ start_date: '2020-04-30T14:48:00.000Z' });
    });
  });
});
