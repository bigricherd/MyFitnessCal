import React, { useState, useEffect } from 'react';

function Dropdown(props) {
    const [options, setOptions] = useState(props.options);

    let optionsArr = [];
    for (let option of options) {
        optionsArr.push(<option value={option} key={option}>{option}</option>)
    }

    useEffect(() => {
        setOptions(props.options);
    }, [props])
    //console.log(options);

    return (
        <select className="btn btn-light dropdown-toggle" name={props.name} id={props.id} value={props.value} onChange={props.onChange} onKeyDown={props.onKeyDown} required>
            {optionsArr}
        </select>
    )
}

export default Dropdown