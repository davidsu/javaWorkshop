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

function getTasks(callback, page = 1, filters = {}){
    let filter = '&'
    _.forEach(filters, (val, key) => {
        if(val){
            filter = filter + key + '=' + val + '&'
        }
    })
    $.get('tasks?page='+page+filter, (data, status) => {
        store.setTasks(xmlToJsonArray(data, 'task'))
        const metaData = xmlToJson(data, 'PageInfo')
        _.forEach(metaData, (val, key) => {
            metaData[key] = Number(val)
        })
        store.setTasksMetadata(metaData)
        callback();
    })
}

function getTaskMetadata(callback){
    $.get('tasks/newTaskMetadata', (data, status) => {
        const usersArray = xmlToJsonArray(data, 'user')
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
}

function getTask(taskId, callback){
    $.get('tasks/' + taskId, (data, status) => {
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
}
function createOrUpdateTask(taskObj, success, fail){
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
        contentType: "application/xml",
        dataType: 'json'
    });
}

function createOrUpdateUser(user, callback){
    $.ajax({
        type: 'POST',
        url: 'users/createOrUpdate',
        data: jsonToXml(user),
        success: callback,
        contentType: "application/xml",
        dataType: 'json'
    });
}

function getUsers(callback) {
    $.get('users', (data, status) => {
        store.setUsers(xmlToJsonArray(data, 'user'))
        callback();
    })
}

function login(user, password, onSuccess, onFail) {
    const jqxhr = $.get(`login?user=${user}&password=${password}`, (data, status) => {
        $.ajaxSetup({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + data);
            }
        });
        onSuccess(data)
    })
    jqxhr.fail(onFail)
}

module.exports = {
    createOrUpdateUser,
    getTask,
    getTaskMetadata,
    getTasks,
    getUsers,
    createOrUpdateTask,
    login
}