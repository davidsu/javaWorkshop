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

function createUser(user){
    console.log(jsonToXml(user));
    $.ajax({
        type: 'POST',
        url: 'users/create',
        data: jsonToXml(user),
        success: () => {
            window.activeMenu = 'users'
            rootComponent.forceUpdate()
        },
        contentType: "application/xml",
        dataType: 'json'
    });
    //$.post('users/create', JSON.stringify(user), () => {
    //    window.activeMenu = 'users'
    //    rootComponent.forceUpdate()
    //}, 'application/json')
}

function updateUser() {

}

module.exports = {
    createUser,
    updateUser
}