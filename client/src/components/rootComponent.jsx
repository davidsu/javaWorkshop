import React from 'react'

class rootComponent extends React.Component {
    render() {
        return (
            <div>
                <h1>Hello World Html</h1>
                <button id="getUsers">getUsers</button>
                <div id="response"></div>
            </div>
        )
    }
}
module.exports = rootComponent