import NavigationMenu from './navigationMenu.jsx'
import SystemLogin from './systemLogin.jsx'
import Tasks from './tasks.jsx'
import Oops from './oops.jsx'
import Task from './task.jsx'
import Users from './users.jsx'
import User from './user.jsx'
import ajax from '../ajax.js'
import store from '../store.js'
import taskController from '../controllers/taskController.js'
import userController from '../controllers/userController'

class rootComponent extends React.Component {

    constructor(){
        super()
        this.setActiveMenuAndRefresh = this.setActiveMenuAndRefresh.bind(this)
        this.setCurrentUser = this.setCurrentUser.bind(this)
        this.refreshUsers = () => userController.getUsers()
    }
    componentWillMount(){
        window.rootComponent = this;
    }

    refreshTasks(){
        ajax.getTasks(() => {
            store.setActiveMenu('tasks')
            window.rootComponent.forceUpdate()
        }, store.getTasksMetadata().Page, store.getTasksFilter)
    }

    setActiveMenuAndRefresh(activeMenu){
        store.setActiveMenu(activeMenu)
        window.rootComponent.forceUpdate()
    }

    setCurrentUser(user){
        userController.getUser(user)
    }

    activePage() {
        switch(true) {
            case /login/.test(store.getActiveMenu()):
                return <SystemLogin onDone={taskController.goToTasks}></SystemLogin>
            case /tasks/.test(store.getActiveMenu()):
                return <Tasks tasks={taskController.getTasks()}
                              metaData={taskController.getTasksMetadata()}
                              setTasksFilter={taskController.setTasksFilter}
                              filter={taskController.getActiveFilter()}
                              setCurrentTask={taskController.setCurrentTask}
                              onAddingTask={taskController.addNewTask}
                              refreshTasks={taskController.goToTasks}></Tasks>
            case /task:.*/.test(store.getActiveMenu()):
                //todo find what logic lives in task and put it in task controller, pass as prop
                return <Task {...store.getCurrentTask()}
                    onClose={taskController.goToTasks}
                    createOrUpdate={taskController.createOrUpdateTask}
                    shouldEnableTaskEdit={/Admin|Requester/.test(store.getUserType())}></Task>
            case /users/.test(store.getActiveMenu()):
                return <Users users={store.getUsers()}
                              setCurrentUser={this.setCurrentUser}
                              onAddingUser={userController.addNewUser}></Users>
            case /user:.*/.test(store.getActiveMenu()):
                return <User user={store.getCurrentUser().user} 
                              userTypes={store.getCurrentUser().userTypes}></User>
            case /oops/.test(store.getActiveMenu()):
                return <Oops status={store.getOops().status} statusText={store.getOops().statusText}></Oops>
            default:
                return <SystemLogin onDone={taskController.goToTasks}></SystemLogin>;
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
