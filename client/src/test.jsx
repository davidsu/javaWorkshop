import RootComponent from './components/rootComponent.jsx'
import ReactDom from 'react-dom'
import React from 'react'

ReactDOM.render(
    <RootComponent></RootComponent>,
    $('#root')[0]
)
$('#getUsers').click(()=> {
    $.get('users', (data, status) => {
        $('#response').html(_.escape(data).replace(/\n/gm, '<br>'))
    })
})
