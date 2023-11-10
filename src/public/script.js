const getById = (id) => {
    return document.getElementById(id)
}

const password = getById('password')
const confirmPassword = getById('confirm-password')
const error = document.getElementById('error')
const success = document.getElementById('success')

error.style.display='none'
success.style.display='none'

