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
import { useEffect, useState } from 'react';
import ProgressCollapse from './ProgressCollapse';
import formatExercise from '../../../helpers/formatExercise';

function ProgressTable(props) {
    const [data, setData] = useState(Object.entries(props.data));
    const [exercise, setExercise] = useState(formatExercise(props.exercise.split(":")[0]));

    useEffect(() => {
        setData(Object.entries(props.data));
        setExercise(formatExercise(props.exercise.split(":")[0]))
    }, [props.data]);

    if (data.length === 0) {
        return (
            <Typography variant="h6" sx={{ fontWeight: "400" }}>No sets found for that exercise.</Typography>
        )
    } else return (
        <TableContainer component={Paper} sx={{ mt: '1rem', borderRadius: "0.88rem" }}>
            <Typography variant="h5" gutterBottom sx={{ mt: '0.5rem' }}>
                {exercise}
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell className="px-3">Session Title</TableCell>
                        <TableCell className="px-3">Date</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {
                        data && data.map((item) => (
                            <ProgressCollapse
                                key={item[0]}
                                data={item[1]}
                                units={props.units}
                                exercise={props.exercise}
                            />
                        ))
                    }

                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ProgressTable;