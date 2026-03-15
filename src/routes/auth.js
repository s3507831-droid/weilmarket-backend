const express = require('express')
const router  = express.Router()
const jwt     = require('jsonwebtoken')
const User    = require('../models/User')

router.get('/nonce/:address', async (req, res) => {
  try {
    let user = await User.findOne({ walletAddress: req.params.address })
    if (!user) user = await User.create({ walletAddress: req.params.address })
    res.json({ nonce: user.nonce })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { address } = req.body
    if (!address) return res.status(400).json({ error: 'Address required' })

    let user = await User.findOne({ walletAddress: address })
    if (!user) user = await User.create({ walletAddress: address })

    user.nonce = Math.floor(Math.random() * 1000000).toString()
    await user.save()

    const token = jwt.sign(
      { address: user.walletAddress, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({ token, user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router