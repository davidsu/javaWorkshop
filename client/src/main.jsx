import RootComponent from './components/rootComponent.jsx'
import ReactDom from 'react-dom'
import React from 'react'
import ajax from './ajax'
import taskController from './controllers/taskController.js'
import userController from './controllers/userController.js'

ReactDOM.render(
    <RootComponent></RootComponent>,
    $('#root')[0]
)

function prettyHtml(str = 'undefined') {
    var notIndented = str.replace(/</g, '\n<').replace(/([^\/]>)(.)/g, '$1\n$2').replace(/\u200b/g, '%u200B');
    var indent = 0;
    var indentStr = '    ';
    var notIndentedArr = notIndented.split('\n').map(function (val) {
        var changeIndent = 0;
        if (!val || !val.indexOf) {
            return val;
        }
        var isBr = /<br.*>/.test(val);
        if (val.indexOf('</') === 0) {
            indent--;
            if (indent < 0) {
                indent = 0;
            }
        } else if (val.indexOf('<') === 0 && !isBr) {
            changeIndent++;
        }
        var res = indentStr.repeat(indent) + val;
        if(!/\/>/.test(val)) {
            indent += changeIndent;
        }
        return res;
    });
    var res = _.filter(notIndentedArr, val=>val.length > 0).join('\n');
    return res;
}

window.prettyHtml = prettyHtml;
