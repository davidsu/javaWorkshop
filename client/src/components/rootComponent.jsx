import React from 'react'
import NavigationMenu from './navigationMenu.jsx'
import SystemLogin from './systemLogin.jsx'
import Tasks from './tasks.jsx'
import Task from './task.jsx'
import Users from './users.jsx'
import User from './user.jsx'
import ajax from '../ajax.js'
import store from '../store.js'


function wishToAddTask(){
    ajax.getTaskMetadata(()=>{
        store.setActiveMenu('task:')
        window.rootComponent.forceUpdate();
    })
}
class rootComponent extends React.Component {

    constructor(){
        super()
        this.goToTasks = this.goToTasks.bind(this)
        this.setActiveMenuAndRefresh = this.setActiveMenuAndRefresh.bind(this)
        this.setCurrentUser = this.setCurrentUser.bind(this)
        this.refreshUsers = this.refreshUsers.bind(this)
    }
    componentWillMount(){
        window.rootComponent = this;
    }

    refreshUsers(){
        ajax.getUsers(() => {
            this.gotToUsers()
        })
    }

    refreshTasks(){
        ajax.getTasks(() => {
            store.setActiveMenu('tasks')
            window.rootComponent.forceUpdate()
        }, store.getTasksMetadata().Page, store.getTasksFilter)
    }
    goToTasks(){
        store.setActiveMenu('tasks');
        window.rootComponent.forceUpdate()
    }
    gotToUsers(){
        store.setActiveMenu('users');
        window.rootComponent.forceUpdate()
    }

    setActiveMenuAndRefresh(activeMenu){
        store.setActiveMenu(activeMenu)
        window.rootComponent.forceUpdate()
    }

    setCurrentUser(user){
        store.setCurrentUser(user)
        this.setActiveMenuAndRefresh('user:')
    }
    setCurrentTask(task){
        store.setCurrentTask(task)
        ajax.getTask(task.id, () => {
            store.setActiveMenu('task:')
            window.rootComponent.forceUpdate();
        })
    }

    activePage() {
        switch(true) {
            case /login/.test(store.getActiveMenu()):
                return <SystemLogin onDone={this.goToTasks}></SystemLogin>
            case /tasks/.test(store.getActiveMenu()):
                return <Tasks tasks={store.getTasks()}
                              metaData={store.getTasksMetadata()}
                              setTasksFilter={store.setTasksFilter}
                              setCurrentTask={this.setCurrentTask}
                              onAddingTask={wishToAddTask}></Tasks>
            case /task:.*/.test(store.getActiveMenu()):
                return <Task {...store.getCurrentTask()} onClose={this.refreshTasks}></Task>
            case /users/.test(store.getActiveMenu()):
                return <Users users={store.getUsers()}
                              setCurrentUser={this.setCurrentUser}></Users>
            case /user:.*/.test(store.getActiveMenu()):
                return <User user={store.getCurrentUser()} onClose={this.refreshUsers} changeUser={this.refreshUsers}></User>
            default:
                return <SystemLogin onDone={this.goToTasks}></SystemLogin>;
        }
    }

    render() {
        return (
            <div>
                <NavigationMenu activeMenu={store.getActiveMenu()} setActiveMenu={this.setActiveMenuAndRefresh}></NavigationMenu>
                {this.activePage()}
            </div>
        )
    }
}
module.exports = rootComponent