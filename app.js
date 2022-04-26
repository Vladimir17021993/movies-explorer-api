const express = require('express');
const console = require('console');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const app = express();

async function main() {
  await mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

  app.listen(PORT, () => {
    console.log(`Server listen on ${PORT}`);
  });
}

main();