export const validateUsername = (rule, value, callback) => {
  if (!value || value.trim().length === 0) {
    callback(new Error('Username is required'))
  } else if (value.length < 3 || value.length > 20) {
    callback(new Error('Username must be between 3 and 20 characters'))
  } else {
    callback()
  }
}

export const validatePassword = (rule, value, callback) => {
  if (!value || value.length < 6) {
    callback(new Error('Password must be at least 6 characters long'))
  } else {
    callback() // 验证通过
  }
}
