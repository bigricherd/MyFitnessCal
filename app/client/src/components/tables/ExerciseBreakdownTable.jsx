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

function ExerciseBreakdownTable(props) {

    return (
        <>
            {/* <Typography variant="h5" gutterBottom sx={{ mt: '0.5rem' }}>
                Breakdown of Exercises
            </Typography> */}
            <TableContainer component={Paper} sx={{ mt: '1rem' }}>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className="px-3">Exercise</TableCell>
                            <TableCell className="px-3"># Sets</TableCell>
                            <TableCell className="px-3">Avg Weight</TableCell>
                            <TableCell className="px-3">Max Weight</TableCell>
                            <TableCell className="px-3">Avg Reps</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {props.data.map((item, i) => (
                            <TableRow key={i}>

                                {/* item[0] is the exercise name */}
                                <TableCell>{formatEnum([item[0]], ' ')}</TableCell>

                                {/* item[1] is an object that contains the statistics for that exercise */}
                                <TableCell>{item[1].count}</TableCell>
                                <TableCell>{item[1].avgWeight}</TableCell>
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