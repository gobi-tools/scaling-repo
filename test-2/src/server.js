const express = require('express');
const app = express();

const PORT = 3000;
const DOMAIN = "server";

const router = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.post(`/flips`, async (req, res) => {
  const body = req.body;
  const flips = body.flips;

  let heads = 0, tails = 0;

  for (i = 0; i < flips; i++) {
    const value = Math.random();
    if (value < 0.5) {
      heads += 1;
    } else {
      tails += 1;
    }
  }
  
  console.log({ heads, tails });
  res.status(200).json({ flips, result: { heads, tails } });
});

app.use(`/${DOMAIN}`, router);

app.listen(PORT, async () => {
  console.log(`App Server listening on port ${PORT}`);
});