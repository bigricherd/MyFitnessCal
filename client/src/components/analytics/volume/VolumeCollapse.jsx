import { useState, useEffect } from 'react';
import {
    Box,
    Collapse,
    IconButton,
    Typography,
    Table,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import formatExercise from '../../../helpers/formatExercise';
import ExerciseBreakdownTable from './ExerciseBreakdownTable';

function VolumeCollapse(props) {
    const [exercises, setExercises] = useState(Object.entries(props.exercises));

    useEffect(() => {
        setExercises(Object.entries(props.exercises));
    }, [props]);

    const [open, setOpen] = useState(false);

    return (
        <>

            {/* Table heading */}
            <TableRow>
                {/* Toggle collapse button*/}
                <TableCell sx={{ width: "5%" }}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => {
                            setOpen(!open);
                        }}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>

                {/* Muscle group */}
                <TableCell component="th" sx={{ fontSize: "1.1em" }}>
                    {formatExercise(props.volume[0])}
                </TableCell>

                {/* Number of sets */}
                <TableCell component="th" sx={{ fontSize: "1.1em" }}>
                    {props.volume[1]}
                </TableCell>

            </TableRow>

            {/* Collapse showing exercise breakdown */}
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box>
                            {exercises && (
                                exercises.length > 0 ?
                                    <ExerciseBreakdownTable data={exercises} units={props.units} muscleGroup={props.volume[0]}/>
                                    :
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell scope="row" align="center">
                                                    <Typography>Don't skip {props.volume[0]}!</Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}

export default VolumeCollapse;