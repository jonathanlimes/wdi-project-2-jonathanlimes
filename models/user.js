const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/

const userSchema = new mongoose.Schema({
  local: {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      required: [true, 'Email address not found.'],
      unique: true,
      lowercase: true,
      match: emailRegex
    },
    password: {
      type: String,
      required: [true, 'Password not found.']
    },
    issue_id: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue'
    }],
    isAdmin: {
      type: Boolean,
      default: false
    }
  }
})

// To hash passwords before they reach the DB, and to compare user's hashed input password with the DB password
userSchema.statics.encrypt = function (password) {
  return bcrypt.hashSync(password, 10)
}
userSchema.methods.validPassword = function (givenPassword) {
  return bcrypt.compareSync(givenPassword, this.local.password)
}

const User = mongoose.model('User', userSchema)
module.exports = User