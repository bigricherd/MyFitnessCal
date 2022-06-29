import React from 'react';

function NumSetsTable(props) {

    let heading = null;
    let avgWeightHeading = null;
    let maxWeightHeading = null;
    let avgRepsHeading = null;
    let tableBody = null;

    if (props.type === 'perMuscleGroup') {
        heading = 'Muscle Group';
        tableBody = <tbody>
            {props.data.map((item, i) => (
                <tr key={i}>
                    <td>{item[0]}</td>
                    <td>{item[1]}</td>
                </tr>
            ))}
        </tbody>;
    } else if (props.type === 'perExercise') {
        heading = 'Exercise';
        avgWeightHeading = <th className="px-3">Avg Weight</th>;
        maxWeightHeading = <th className="px-3">Max Weight</th>;
        avgRepsHeading = <th className="px-3">Avg Reps</th>;

        console.log(props.data);
        tableBody = <tbody>
            {props.data.map((item, i) => (
                <tr key={i}>
                    <td>{item[0]}</td>
                    <td>{item[1].count}</td>
                    <td>{item[1].avgWeight}</td>
                    <td>{item[1].maxWeight}</td>
                    <td>{item[1].avgReps}</td>
                </tr>
            ))}
        </tbody>;
    }
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th className="px-3">{heading}</th>
                        <th className="px-3"># Sets</th>
                        {avgWeightHeading}
                        {maxWeightHeading}
                        {avgRepsHeading}
                    </tr>
                </thead>
                {tableBody}
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