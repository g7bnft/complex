const express = require("express");
const { pgPool } = require("../db/postgres");
const { redisClient } = require("../db/redis");

const router = express.Router();
const redisPublisher = redisClient.duplicate();
redisPublisher.on('error', (error) => console.error('Redis Publisher Client Error', error));

router.get("/all", async (req, res) => {
  try {
    const values = await pgPool.query("SELECT * FROM values");
    res.send(values.rows);
  } catch (error) {
    console.error("Error fetching values from PostgreSQL:", error);
    res
      .status(500)
      .send({ error: "Failed to retrieve values from PostgreSQL" });
  }
});

router.get("/current", async (req, res) => {
  try {
    const values = await redisClient.hgetall("values");
    res.send(values);
  } catch (error) {
    console.error("Error fetching values from Redis:", error);
    res.status(500).send({ error: "Failed to retrieve values from Redis" });
  }
});

// ... other routes ...
router.post('/', async (req, res) => {
  const index = req.body.index;
  if (parseInt(index) > 40) {
    return res.statuus(422).send('Index too high');
  }
  try {
    await redisClient.hset('values',index, 'Nothing yes1');
  } catch (error)  {
    console.error(error);
  }
  try {
    await redisPublisher.publish('insert', index);
  } catch (error) {
    console.error(error)
  }

  try {
    await pgPool.query('INSERT INTO values(number) VALUES($1)', [index]);
  } catch (error) {
    console.error(error)
  }
  res.send({working: true});

})

module.exports = router;