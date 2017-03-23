import store from '../store.js'
import ajax from '../ajax.js'
import _ from 'lodash'
const getUsers = (callback = _.noop) => {
    ajax.getUsers(() => {
        store.setActiveMenu('users')
        window.rootComponent.forceUpdate()
        callback()
    })
}

module.exports = {
    getUsers
}
