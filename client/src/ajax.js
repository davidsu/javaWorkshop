import _ from 'lodash'
function jsonToXml(jsonObj){
    var xmlDoc = document.implementation.createDocument(null, "user");
    _.forEach(jsonObj, (val, key) => {
        const element = xmlDoc.createElement(key);
        element.textContent = val;
        xmlDoc.firstChild.appendChild(element);
    })
    var serializer = new XMLSerializer();
    var xmlString = serializer.serializeToString(xmlDoc);
    console.log(xmlDoc)
    return xmlString;
}

function createUser(user, callback){
    console.log(jsonToXml(user));
    $.ajax({
        type: 'POST',
        url: 'users/create',
        data: jsonToXml(user),
        success: callback,
        contentType: "application/xml",
        dataType: 'json'
    });
    //$.post('users/create', JSON.stringify(user), () => {
    //    window.activeMenu = 'users'
    //    rootComponent.forceUpdate()
    //}, 'application/json')
}

function getUsers(callback) {
    $.get('users', (data, status) => {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        window.store.users = _.map(xmlDoc.getElementsByTagName('user'), userElement => {
            return {
                id: userElement.querySelector('id').textContent,
                full_name: userElement.querySelector('full_name').textContent,
                type: userElement.querySelector('type').textContent,
                email: userElement.querySelector('email').textContent,
                password: userElement.querySelector('password').textContent,
            }
        })
        callback();
    })
}

function updateUser() {

}

module.exports = {
    createUser,
    getUsers,
    updateUser
}