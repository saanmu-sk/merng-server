const validateRegisterInput = (username, email, password, confirmPassword) => {
    const errors = {}
    if (username.trim() === '') {
        errors.username = 'Username is required!'
    }
    if (email.trim() === '') {
        errors.email = 'Email is required!'
    } else if (!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        errors.email = 'Invalid Email address!'
    }
    if (password === '') {
        errors.password = 'Password is required!'
    } else if (password.length < 6) {
        errors.password = 'Password must be at least have 6 characters!'
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Password and confirm password are must be same!'
    }
    if (confirmPassword === '') {
        errors.confirmPassword = 'Confirm Password is required!'
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

const validateLoginInput = (username, password) => {
    const errors = {}
    if (username.trim() === '') {
        errors.username = 'Username is required!'
    }
    if (password === '') {
        errors.password = 'Password is required!'
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports = {
    validateRegisterInput,
    validateLoginInput
}