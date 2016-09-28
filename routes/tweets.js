const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const TweetsController = require('../controllers/TweetsController');

/* GET users listing. */
router.get('/', TweetsController.list);

// router.get('/:id', TweetsController.show);

router.post('/', TweetsController.create);

// router.put('/:id', TweetsController.update);
//
// router.delete('/:id', TweetsController.remove);

module.exports = router;
