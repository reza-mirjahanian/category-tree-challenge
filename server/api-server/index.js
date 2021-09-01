'use strict';
const express = require('express'),
  constants = require('../constants'),
  categoryRepo = require('../repository/category'),

  cors = require('cors'),
  logger = require('../utils/logger');

const app = express();
app.use(express.json());
app.use(cors());


// main page
app.get('/', (req, res) => res.send('Server is running'));

//api/categories
//api/categories?id=1
app.get('/api/categories', async (req, res) => {
  try {

    const {id} = req.query;
    const result = await categoryRepo.getCategories({
      parentId: id
    });
    const treeFormat = categoryRepo.treeFormatter(result);

    return res.status(200).send(treeFormat);
  } catch (err) {
    logger.error(req.path, {
      err
    });
    res.status(500).send("Error");
  }
});



app.listen(constants.EXPRESS_PORT, () => logger.log(`listening on port ${constants.EXPRESS_PORT}!`));
