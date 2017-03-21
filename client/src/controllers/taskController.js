import store from '../store.js'
import ajax from '../ajax.js'
import _ from 'lodash'
const setCurrentTask = (task) => {
    store.setCurrentTask(task)
    ajax.getTask(task.id, () => {
        store.setActiveMenu('task:')
        window.rootComponent.forceUpdate();
    })
}

function addNewTask(){
    ajax.getTaskMetadata(()=>{
        store.setActiveMenu('task:')
        window.rootComponent.forceUpdate();
    })
}

function goToTasks(onSucess = _.noop){
    ajax.getTasks(() => {
        store.setActiveMenu('tasks')
        window.rootComponent && window.rootComponent.forceUpdate()
        onSucess()
    }, _.get(store.getTasksMetadata(), 'Page'), store.getTasksFilter())
}

function getTasks(){
    return store.getTasks();
}

const getTasksMetadata = store.getTasksMetadata
const setTasksFilter = (filter) => {
    store.setTasksFilter(filter)
}

const getActiveFilter = store.getTasksFilter

module.exports = {
    addNewTask,
    getActiveFilter,
    getTasks,
    goToTasks,
    setCurrentTask,
    getTasksMetadata,
    setTasksFilter
}