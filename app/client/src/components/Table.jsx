import React from 'react';

function Table(props) {
    return (
        <table>
            <tr>
                <th>Reps</th>
                <th>Weight</th>
                <th>Date</th>
                <th>Exercise</th>
                <th>Muscle Group</th>
                <th>Comments</th>
            </tr>
            {props.data.map((item, i) => (
                <tr key={i}>
                    <td>{item.reps}</td>
                    <td>{item.weight}</td>
                    <td>{item.date}</td>
                    <td>{item.exercise}</td>
                    <td>{item.musclegroup}</td>
                    <td>{item.comments}</td>
                </tr>
            ))}
        </table>
    )
}

export default Table;