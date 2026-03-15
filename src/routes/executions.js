const express   = require('express')
const router    = express.Router()
const Execution = require('../models/Execution')

router.get('/', async (req, res) => {
  try {
    const filter = {}
    if (req.query.caller) filter.caller = req.query.caller
    const executions = await Execution.find(filter)
      .populate('appletId', 'name category')
      .sort({ createdAt: -1 })
      .limit(50)
    res.json(executions)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router