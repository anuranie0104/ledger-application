const express = require('express');
const router = express.Router();
const ledgerController = require('../controllers/ledgerControllers');
const ledgerValidation = require('../validations/ledgerValidations');

// Ledger routes -- input validation and then business logic.
router.post('/ledger', ledgerValidation.validate('ledger'), ledgerController.fetchLedger);

module.exports = router;