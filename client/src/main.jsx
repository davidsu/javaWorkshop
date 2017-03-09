import RootComponent from './components/rootComponent.jsx'
import ReactDom from 'react-dom'
import React from 'react'
window.activeMenu = 'login'
window.store = {}
ReactDOM.render(
    <RootComponent></RootComponent>,
    $('#root')[0]
)
