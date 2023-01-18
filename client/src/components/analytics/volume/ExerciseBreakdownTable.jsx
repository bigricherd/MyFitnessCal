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

                            {props.data[0][0].split(":")[1] !== "cardio" ? 
                                /* Resistance training headers */
                                <>
                                <TableCell align="center">
                                                { props.units === "lb" ?"Max Weight (lb)" : "Max Weight (kg)" }
                                            </TableCell>
                                <TableCell className="px-3">Avg Reps</TableCell>
                                </>
                                :
                                /* Cardio headers */
                                <>
                                <TableCell align="center">
                                    Max Distance
                                </TableCell>
                                <TableCell className="px-3">
                                    Max Duration
                                </TableCell>
                                </>
                            }


                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {props.data.map((item, i) => (
                            <TableRow key={i}>

                                {/* item[0] is the exercise name */}
                                <TableCell>{formatExercise(item[0].split(":")[0], ' ')}</TableCell>

                                {/* item[1] is an object that contains the statistics for that exercise */}
                                <TableCell>{item[1].count}</TableCell>

                                {/* Condition on whether exercise is cardio or not */}
                                {item[0].split(":")[1] !== "cardio" ?
                                    /* Resistance training stats */
                                    <>
                                    <TableCell align="center">
                                        {props.units === "lb" ?
                                            item[1].maxWeight :
                                            (Math.round(parseInt(item[1].maxWeight) / 2.20462262)).toString()
                                        }
                                    </TableCell> 

                                    <TableCell>{item[1].avgReps}</TableCell>
                                    </>
                                    :
                                    /* Cardio stats */
                                    <>
                                    <TableCell align="center">
                                        {item[1]["distance"]["max"]}
                                    </TableCell> 

                                    <TableCell>
                                    {item[1]["duration"]["max"]}
                                    </TableCell>
                                    </>
                                }

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default ExerciseBreakdownTable;