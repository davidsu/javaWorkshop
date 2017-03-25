import store from '../store.js'
import ajax from '../ajax.js'
import _ from 'lodash'
import consts from '../consts'

const getUsers = (callback = _.noop) => {
    ajax.getUsers(() => {
        store.setActiveMenu('users')
        window.rootComponent && window.rootComponent.forceUpdate()
        callback()
    })
}

const createOrUpdate = (user, callback = getUsers) => {
    ajax.createOrUpdateUser(user, callback)
}

const getUser = (user) => {
    ajax.getUser(user.id, () => {
        store.setActiveMenu('user:')
        window.rootComponent.forceUpdate()
    })
}

const addNewUser = () => ajax.getUserMetadata((usersMetadata) => {
    const user = _.reduce(consts.userFields, (acc, val) => {
        acc[val] = '';
        return acc;
    }, {})
    user.type = undefined
    store.setCurrentUser(_.assign({}, {user}, usersMetadata))
    store.setActiveMenu('user:')
    window.rootComponent.forceUpdate();
})
const getCurrentUser = store.getCurrentUser

module.exports = {
    getUsers,
    goToUsers: getUsers,
    addNewUser,
    getUser,
    createOrUpdate,
    getCurrentUser
}
