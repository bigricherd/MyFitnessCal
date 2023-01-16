import {
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import formatExercise from '../../../helpers/formatExercise';

function ExerciseBreakdownTable(props) {

    return (
        <>
            <TableContainer component={Paper} sx={{ mt: '1rem' }}>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className="px-3">Exercise</TableCell>
                            <TableCell className="px-3"># Sets</TableCell>
                            <TableCell align="center">
                                            { props.units === "lb" ?"Max Weight (lb)" : "Max Weight (kg)" }
                                        </TableCell>
                            <TableCell className="px-3">Avg Reps</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {props.data.map((item, i) => (
                            <TableRow key={i}>

                                {/* item[0] is the exercise name */}
                                <TableCell>{formatExercise(item[0], ' ')}</TableCell>

                                {/* item[1] is an object that contains the statistics for that exercise */}
                                <TableCell>{item[1].count}</TableCell>

                                {/* TODO support display in kg if props.units === "kg" */}
                                <TableCell align="center">
                                    {props.units === "lb" ?
                                        item[1].maxWeight :
                                        (Math.round(parseInt(item[1].maxWeight) / 2.20462262)).toString()
                                    }
                                </TableCell> 

                                <TableCell>{item[1].avgReps}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default ExerciseBreakdownTable;