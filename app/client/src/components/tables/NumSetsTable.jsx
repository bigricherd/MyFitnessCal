import React from 'react';
import {
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography
} from '@mui/material';
import formatEnum from '../../helpers/formatEnum';

function NumSetsTable(props) {

    let heading = null;
    let avgWeightHeading = null;
    let maxWeightHeading = null;
    let avgRepsHeading = null;
    let tableBody = null;

    let title = <Typography variant="h5" gutterBottom sx={{ mt: '0.5rem' }}>
        {(props.type === 'perMuscleGroup') ? '# Sets per Muscle Group' : 'Breakdown of Exercises'}
    </Typography>

    if (props.type === 'perMuscleGroup') {
        heading = 'Muscle Group';
        tableBody = <TableBody>
            {props.data.map((item, i) => (
                <TableRow key={i}>
                    {/* FormatEnum here at item[0] */}
                    <TableCell>{formatEnum([item[0]], ' ')}</TableCell>
                    <TableCell>{item[1]}</TableCell>
                </TableRow>
            ))}
        </TableBody>;
    } else if (props.type === 'perExercise') {
        heading = 'Exercise';
        avgWeightHeading = <TableCell className="px-3">Avg Weight</TableCell>;
        maxWeightHeading = <TableCell className="px-3">Max Weight</TableCell>;
        avgRepsHeading = <TableCell className="px-3">Avg Reps</TableCell>;

        console.log(props.data);
        tableBody = <TableBody>
            {props.data.map((item, i) => (
                <TableRow key={i}>
                    {/* FormatEnum here at item[0] */}
                    <TableCell>{formatEnum([item[0]], ' ')}</TableCell>
                    <TableCell>{item[1].count}</TableCell>
                    <TableCell>{item[1].avgWeight}</TableCell>
                    <TableCell>{item[1].maxWeight}</TableCell>
                    <TableCell>{item[1].avgReps}</TableCell>
                </TableRow>
            ))}
        </TableBody>;
    }
    return (
        <TableContainer component={Paper} sx={{ mt: '1rem' }}>
            {title}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className="px-3">{heading}</TableCell>
                        <TableCell className="px-3"># Sets</TableCell>
                        {avgWeightHeading}
                        {maxWeightHeading}
                        {avgRepsHeading}
                    </TableRow>
                </TableHead>
                {tableBody}
            </Table>
        </TableContainer>
    )
}

export default NumSetsTable;