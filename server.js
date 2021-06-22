const express = require('express');
const ledgerRoutes = require('./routes/ledgerRoutes');

const app = express();
app.use(express.json());
const port = 3000;

app.use('/', ledgerRoutes);

// Opens port.
app.listen(port, () => {
  console.log('Server started on port: ' + port);
});