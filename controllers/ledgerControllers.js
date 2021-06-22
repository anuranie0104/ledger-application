const { validationResult } = require('express-validator');

/**
 *  Function that calculates ledger for a weekly or fortnightly frequency
 * 
 * @param   {string} startDateISO   Start date in ISO string format.
 * @param   {string} endDateISO     End date in ISO string format.
 * @param   {string} frequency      Frequency of payment calculation.
 * @param   {number} weeklyRent     Weekly amount to be paid.
 * @returns {Object[]}  Returns an array of ledger objects which includes 'start_date', 'end_date' and 'amount'.
 */
const ledgerWeeklyCalculation = (startDateISO, endDateISO, frequency, weeklyRent) => {
  // Converts dates into Date format.
  let rentDate = new Date(startDateISO);
  const endDate = new Date(endDateISO);

  const numberOfDays = frequency === 'weekly' ? 7 : 14; // Weekly = 7, fortnightly = 14.
  const ledger = [];

  while (rentDate <= endDate) { // Runs while loop as long as rentDate is less than endDate.
    const startDate = rentDate.toISOString(); // Sets line startDate in ISO string format so it does not change with changes to rentDate.

    // Following lines calculate the difference in days between rentDate and endDate.
    const timeDifference = Math.abs(rentDate - endDate);
    const DayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (DayDifference < numberOfDays) { // When difference of days falls short of frequency.
      const amount = weeklyRent / 7 * (DayDifference + 1); // Rent calculation for remaining days.
      ledger.push({
        start_date: startDate,
        end_date: endDate.toISOString(),
        amount: Math.round((amount + Number.EPSILON) * 100) / 100 // Rounds off calculation to 2 decimals.
      });
      rentDate = new Date(endDate);
    } else {
      rentDate.setDate(rentDate.getDate() + (numberOfDays - 1)); // Sets rentDate to the end date based on frequency.
      ledger.push({
        start_date: startDate,
        end_date: rentDate.toISOString(),
        amount: frequency === 'weekly' ? weeklyRent : weeklyRent * 2 // Rent calculation based on frequency.
      });

      if (rentDate.valueOf() === endDate.valueOf()) { // Instance where rentDate and endDate are equal 
        rentDate = new Date(endDate);
      }
    }
    rentDate.setDate(rentDate.getDate() + 1); // Adds a day to rentDate to configure new startDate.
  }
  return ledger;
};

/**
 * Function that calculates ledger for a monthly frequency
 * 
 * @param   {string} startDateISO   Start date in ISO string format.
 * @param   {string} endDateISO     End date in ISO string format.
 * @param   {number} weeklyRent     Weekly amount to be paid.
 * @returns {Object[]}  Returns an array of ledger objects which includes 'start_date', 'end_date' and 'amount'. 
 */
const ledgerMonthlyCalculation = (startDateISO, endDateISO, weeklyRent) => {
  // Converts dates into Date format.
  let rentDate = new Date(startDateISO);
  const endDate = new Date(endDateISO);

  const date = JSON.parse(JSON.stringify(rentDate.getDate())); // Sets date of the month to constant value.
  const ledger = [];

  while (rentDate <= endDate) { // Runs while loop as long as rentDate is less than endDate.
    const startDate = rentDate.toISOString(); // Sets line startDate in ISO string format so it does not change with changes to rentDate.

    // Sets the year, month, hours, minutes, seconds and milliseconds for further usage.
    const year = rentDate.getFullYear();
    let month = rentDate.getMonth();
    const hours = rentDate.getHours();
    const minutes = rentDate.getMinutes();
    const seconds = rentDate.getSeconds();
    const milliseconds = rentDate.getMilliseconds();

    month = month + 1; // Calculates the next month index.
    let nextRentDate = new Date(year, month, date, hours, minutes, seconds, milliseconds); // Sets the nextRentDate using params.

    // Checks if nextRentDate date of the month is not equal to 'date' variable.
    //   Eg: date = 31, but month only has 28 or 29 or 30 days.
    if (nextRentDate.getDate() !== date) {
      if (month === 1) { // If month is February (index = 1).
        const isLeap = new Date(year, 1, 29).getDate() === 29; // Checks if leap year.
        const febDate = isLeap ? 29 : 28; // Sets February date based on leap year or not.
        nextRentDate = new Date(year, month, febDate, hours, minutes, seconds, milliseconds); // Sets nextRentDate based on altered date parameter.
      } else {
        nextRentDate = new Date(year, month, date - 1, hours, minutes, seconds, milliseconds); // Sets nextRentDate based on altered date parameter.
      }
    }

    const lineEndDate = new Date(nextRentDate);
    lineEndDate.setDate(lineEndDate.getDate() - 1); // Deducts a day to get ledger lineEndDate
    if (lineEndDate > endDate) { // When the remaining days are less than a month.
      // Following lines calculate the difference in days between rentDate and endDate.
      const timeDifference = Math.abs(new Date(startDate) - endDate);
      const DayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

      const amount = weeklyRent / 7 * (DayDifference + 1); // Rent calculation for remaining days.
      ledger.push({
        start_date: startDate,
        end_date: endDate.toISOString(),
        amount: Math.round((amount + Number.EPSILON) * 100) / 100 // Rounds off calculation to 2 decimals.
      });
      rentDate = new Date(endDate);
    } else {
      const amount = (weeklyRent / 7) * 365 / 12; // Rent calculation for a month.
      ledger.push({
        start_date: startDate,
        end_date: lineEndDate.toISOString(),
        amount: Math.round((amount + Number.EPSILON) * 100) / 100 // Rounds off calculation to 2 decimals.
      });

      if (lineEndDate.valueOf() === endDate.valueOf()) { // Instance where lineEndDate and endDate are equal 
        rentDate = new Date(endDate);
      } else {
        rentDate = new Date(lineEndDate);
      }
    }
    rentDate.setDate(rentDate.getDate() + 1); // Adds a day to rentDate to configure new startDate.
  }
  return ledger;
};


/**
 * fetchLedger request function
 * 
 * @param {Object} req Http request object.
 * @param {Object} res Http response object.
 */
const fetchLedger = (req, res) => {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object.
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() }); // Returns error code with error message.
    return;
  }

  const { start_date, end_date, frequency, weekly_rent, timezone } = req.body // Sets input parameters.

  let ledger;
  if (frequency === 'monthly') {
    ledger = ledgerMonthlyCalculation(start_date, end_date, weekly_rent); // Calls ledger calculation function for monthly frequency.
  } else {
    ledger = ledgerWeeklyCalculation(start_date, end_date, frequency, weekly_rent); // Calls monthly ledger calculation function for weekly/fornightly frequency.
  }

  res.status(200).json({ ledger }); // Returns success code with ledger.
};

module.exports = {
  fetchLedger,
  ledgerWeeklyCalculation,
  ledgerMonthlyCalculation
};