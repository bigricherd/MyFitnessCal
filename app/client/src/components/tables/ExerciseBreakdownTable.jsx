import {
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import formatExercise from '../../helpers/formatExercise';

function ExerciseBreakdownTable(props) {

    return (
        <>
            <TableContainer component={Paper} sx={{ mt: '1rem' }}>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className="px-3">Exercise</TableCell>
                            <TableCell className="px-3"># Sets</TableCell>
                            <TableCell className="px-3">Max Weight</TableCell>
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
                                <TableCell>{item[1].maxWeight}</TableCell>
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