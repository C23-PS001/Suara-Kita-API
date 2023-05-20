const { register, login, getData } = require('../handler/user.handler')

module.exports = [
    {
        method: 'POST',
        path: '/user/register',
        handler: register
    },
    {
        method: 'POST',
        path: '/user/login',
        handler: login
    },
    {
        method: 'GET',
        path: '/user',
        handler: getData
    }
]