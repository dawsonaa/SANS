const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const csrf = require('csurf');

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('combined'));
app.use(csrf({ cookie: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello, Secure World!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
