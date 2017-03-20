import React from 'react'
import NavigationMenu from './navigationMenu.jsx'
import SystemLogin from './systemLogin.jsx'
import Tasks from './tasks.jsx'
import Task from './task.jsx'
import Users from './users.jsx'
import User from './user.jsx'
import ajax from '../ajax.js'


class rootComponent extends React.Component {

    componentWillMount(){
        window.rootComponent = this;
    }

    getUsers() {
        $.get('users', (data, status) => {
            $('#response').html(_.escape(data).replace(/\n/gm, '<br>'))
        })
    }

    refreshTasks(){
        ajax.getTasks(() => {
            window.store.activeMenu = 'tasks'
            window.rootComponent.forceUpdate()
        }, window.store.tasksMetaData.Page, window.store.tasksFilter)
    }
    activePage() {
        switch(true) {
            case /login/.test(window.store.activeMenu):
                return <SystemLogin></SystemLogin>
            case /tasks/.test(window.store.activeMenu):
                return <Tasks tasks={window.store.tasks} metaData={window.store.tasksMetaData}></Tasks>
            case /task:.*/.test(window.store.activeMenu):
                return <Task {...window.store.task} onClose={this.refreshTasks}></Task>
            case /users/.test(window.store.activeMenu):
                return <Users users={window.store.users}></Users>
            case /user:.*/.test(window.store.activeMenu):
                return <User user={window.store.user}></User>
            default:
                return <SystemLogin></SystemLogin>;
        }
    }

    render() {
        return (
            <div>
                <NavigationMenu></NavigationMenu>
                {this.activePage()}
            </div>
        )
    }
}
module.exports = rootComponent