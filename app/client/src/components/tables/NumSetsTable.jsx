import React from 'react';

function NumSetsTable(props) {
    let heading = null;
    if (props.type === 'perMuscleGroup') {
        heading = 'Muscle Group'
    } else if (props.type === 'perExercise') {
        heading = 'Exercise';
    }
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th className="px-3">{heading}</th>
                        <th className="px-3"># Sets</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((item, i) => (
                        <tr key={i}>
                            <td>{item[0]}</td>
                            <td>{item[1]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* <table>
                <thead>
                    <tr>
                        <th className="px-3">Exercise</th>
                        <th className="px-3"># Sets</th>
                    </tr>
                </thead>
                <tbody>
                    {props.exerciseData.map((item, i) => {
                        <tr key={i}>
                            <td>{item[0]}</td>
                            <td>{item[1]}</td>
                        </tr>
                    })}
                </tbody>
            </table> */}

        </div>
    )
}

export default NumSetsTable;