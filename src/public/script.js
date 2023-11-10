const getById = (id) => {
    return document.getElementById(id)
}

const password = getById('password')
const confirmPassword = getById('confirm-password')
const form = getById('form')
const container = getById('container')
const loader = getById('loader')
const button = getById('submit')
const error = document.getElementById('error')
const success = document.getElementById('success')

error.style.display = 'none'
success.style.display = 'none'
container.style.display = 'none'

let token, userId;


window.addEventListener('DOMContentLoaded', async () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => {
            return searchParams.get(prop)
        }

    })
    token = params.token
    userId = params.userId

    const res = await fetch("/auth/verify-pass-reset-token",
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({
                token, userId
            })
        })
    if (!res.ok) {
        const {error} = await res.json()
        console.log(error)
        loader.innerText = error
        return

    }

    loader.style.display = "none"
    container.style.display = "block"

})


