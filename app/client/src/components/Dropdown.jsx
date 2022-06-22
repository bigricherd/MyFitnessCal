import React from 'react';

function Dropdown(props) {
    let options = [];
    for (let option of props.options) {
        options.push(<option value={option} key={option}>{option}</option>)
    }
    //console.log(options);

    return (
        <select className="btn btn-light dropdown-toggle" name={props.name} id={props.id} value={props.value} onChange={props.onChange} onKeyDown={props.onKeyDown} required>
            {options}
        </select>
    )
}

export default Dropdown