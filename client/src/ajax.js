import _ from 'lodash'
import store from './store.js'

$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer testuser');
    }
});
function jsonToXml(jsonObj){
    var xmlDoc = document.implementation.createDocument(null, "user");
    _.forEach(jsonObj, (val, key) => {
        const element = xmlDoc.createElement(key);
        element.textContent = val;
        xmlDoc.firstChild.appendChild(element);
    })
    var serializer = new XMLSerializer();
    var xmlString = serializer.serializeToString(xmlDoc);
    return xmlString;
}

//todo remove xmlUtils from here, stopr parsing the result here, let controllers do that instead
function xmlToJsonArray(data, elementName){
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(data, 'text/xml');
    const result = _.map(xmlDoc.getElementsByTagName(elementName), userElement => {
        return _.reduce(userElement.children, (acc, child)=>{
            acc[child.tagName] = child.textContent
            return acc
        }, {})
    })
    return result;
}

function xmlToJson(data, elementName){
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(data, 'text/xml');
    const element = xmlDoc.getElementsByTagName(elementName)[0];
    const result = _.reduce(element.children, (acc, child) => {
        acc[child.tagName] = child.textContent
        return acc
    }, {})
    return result;
}

function defaultOops(err){
    console.log(arguments)
    store.setOops(err)
    store.setUserType(null)
    store.setActiveMenu('oops')
    window.rootComponent && window.rootComponent.forceUpdate()
}

//todo onFail
function getTasks(callback, page = 1, filters = {}){
    let filter = '&'
    _.forEach(filters, (val, key) => {
        if(val){
            filter = filter + key + '=' + val + '&'
        }
    })
    const jqxhr = $.get('tasks?page='+page+filter, (data, status) => {
        store.setTasks(xmlToJsonArray(data, 'task'))
        const metaData = xmlToJson(data, 'PageInfo')
        _.forEach(metaData, (val, key) => {
            metaData[key] = Number(val)
        })
        store.setTasksMetadata(metaData)
        callback();
    })
    jqxhr.fail(defaultOops)
}

function getUserMetadata(callback, onFail = defaultOops){
    const jqxhr = $.get('users/newUserMetadata', (data, status) => {
        const usersMetadata = {
            userTypes: xmlToJsonArray(data, 'userTypeEntry')
        }
        // store.setCurrentUser({
        //     user: {},
        //     userTypes: xmlToJsonArray(data, 'user')
        // })
        callback(usersMetadata)
    })
    jqxhr.fail(onFail)
}
function getTaskMetadata(callback, onFail = defaultOops){
    const jqxhr = $.get('tasks/newTaskMetadata', (data, status) => {
        store.setCurrentTask({
            task: {},
            taskTypes: xmlToJsonArray(data, 'taskTypeEntry'),
            products: xmlToJsonArray(data, 'product'),
            environments: xmlToJsonArray(data, 'environment'),
            users: xmlToJsonArray(data, 'user'),
            priority: xmlToJsonArray(data, 'priority'),
            status: xmlToJsonArray(data, 'status')
        })
        callback()
    })
    jqxhr.fail(onFail)
}

function getTask(taskId, callback, onFail = defaultOops){
    const jqxhr = $.get('tasks/' + taskId, (data, status) => {
        const usersArray = xmlToJsonArray(data, 'user')
        store.setCurrentTask({
            task: xmlToJsonArray(data, 'task')[0],
            taskTypes: xmlToJsonArray(data, 'taskTypeEntry'),
            products: xmlToJsonArray(data, 'product'),
            environments: xmlToJsonArray(data, 'environment'),
            users: xmlToJsonArray(data, 'user'),
            priority: xmlToJsonArray(data, 'priority'),
            status: xmlToJsonArray(data, 'status')
        })
        callback()
    })
    jqxhr.fail(onFail)
}
function createOrUpdateTask(taskObj, success, fail = defaultOops){
    const updateObj = _.reduce(taskObj, (acc, val, key) =>{
        if(val !== store.getCurrentTask()[key] || (key === 'id' && val)){
            acc[key] = val;
        }
        return acc;
    }, {})
    $.ajax({
        type: 'POST',
        url: 'tasks/createOrUpdate',
        data: jsonToXml(updateObj),
        success: success,
        error: fail,
        contentType: "application/xml"
    });
}

function createOrUpdateUser(user, callback, onFail = defaultOops){
    $.ajax({
        type: 'POST',
        url: 'users/createOrUpdate',
        data: jsonToXml(user),
        success: () => {
            callback()
        },
        error: onFail,
        contentType: "application/xml"
    });
}

function getUsers(callback, onFail = defaultOops) {
    const jqxhr = $.get('users', (data, status) => {
        store.setUsers(xmlToJsonArray(data, 'user'))
        callback();
    })
    jqxhr.fail(onFail)
}

function login(user, password, onSuccess, onFail = defaultOops) {
    const jqxhr = $.get(`login?user=${user}&password=${password}`, (data, status) => {
        $.ajaxSetup({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + data);
            }
        });
        store.setUserType(data.split('_')[0])
        onSuccess(data)
    })
    jqxhr.fail(onFail)
}

function getUser(userId, callback, onFail = defaultOops){
    const jqxhr = $.get('users/' + userId, (data, status) => {
        const usersArray = xmlToJsonArray(data, 'user')
        store.setCurrentUser({
            user: xmlToJsonArray(data, 'user')[0],
            userTypes: xmlToJsonArray(data, 'userTypeEntry'),
        })
        callback()
    })
    jqxhr.fail(onFail)
}
module.exports = {
    createOrUpdateUser,
    getTask,
    getTaskMetadata,
    getTasks,
    getUsers,
    getUserMetadata,
    createOrUpdateTask,
    login,
    getUser
}
