const { body } = require('express-validator');

/**
 * Function that validates all ledger methods.
 * 
 * @param   {string}  method Route method.
 * @returns {Object}  Returns an object with the errors if present
 */
const validate = (method) => {
  switch (method) {
    case 'ledger': {
      return [
        // The following lines check if the parameters exist or not
        body('start_date', 'start_date does not exists').exists(),
        body('end_date', 'end_date does not exists').exists(),
        body('frequency', 'frequency does not exists').exists(),
        body('weekly_rent', 'weekly_rent does not exists').exists(),
        body('timezone', 'timezone does not exists').optional(),

        // The following lines are validations for specific parameters
        body('start_date', 'start_date has to be an ISO string').isISO8601(), // 'start_date' should be an ISO string.
        body('end_date', 'end_date has to be an ISO string').isISO8601(), // 'end_date' should be an ISO string.
        body('start_date', 'start_date is a date after end_date.').custom((value, { req }) => value < req.body.end_date),  //'start_date' should be before 'end_date'.
        body('weekly_rent', 'weekly_rent has to decimal or integer').isFloat(), // 'weekly_rent' should be a decimal or integer.
        body('frequency', 'frequency has to \'weekly\',\'fortnightly\' or \'monthly\'').isIn(['weekly', 'fortnightly', 'monthly']) // 'frequency' cannot be anything other than the given.
      ]
    }
  }
}

module.exports = {
  validate
};