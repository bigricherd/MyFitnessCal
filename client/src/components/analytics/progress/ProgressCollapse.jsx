import { useState, useEffect } from 'react';
import {
    Box,
    Collapse,
    IconButton,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { formatDateSlashes } from "../../../helpers/formatDate";

function ProgressCollapse(props) {
    const [sets, setSets] = useState(props.data.sets);
    const [title, setTitle] = useState(props.data.title);
    const [date, setDate] = useState(formatDateSlashes(props.data.date));

    useEffect(() => {
        setSets(props.data.sets);
        setTitle(props.data.title);
        setDate(formatDateSlashes(props.data.date));
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

                {/* Session title */}
                <TableCell component="th" sx={{ fontSize: "1.1em" }}>
                    {title}
                </TableCell>

                {/* Session date */}
                <TableCell component="th" sx={{ fontSize: "1.1em" }}>
                    {date}
                </TableCell>

            </TableRow>

            {/* Collapse showing sets */}
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box>
                            <Table size="small" aria-label="sets">

                                {/* Table header */}
                                <TableHead>
                                    <TableRow>
                                        { props.exercise.split(":")[1] !== "cardio" ?
                                        /* Resistance training headers */
                                        <>
                                        <TableCell align="center">
                                            { props.units === "lb" ?"Weight (lb)" : "Weight (kg)" }
                                        </TableCell>
                                        <TableCell align="center">
                                            Reps
                                        </TableCell>
                                        </>
                                        :
                                        <>
                                        {/* Cardio headers */}
                                        <TableCell align="center">
                                            Distance
                                        </TableCell>
                                        <TableCell align="center">
                                            Duration
                                        </TableCell>
                                        </>
                                        }
                                    </TableRow>
                                </TableHead>

                                {/* Sets performed in this session, shown as rows */}
                                <TableBody>
                                    {sets && sets.map((set) =>
                                    
                                        <TableRow key={set.id} sx={{ '& > *': { border: '0px solid' } }}>
                                        {  props.exercise.split(":")[1] !== "cardio" ?
                                            <>
                                            <TableCell align="center">
                                                {props.units === "lb" ?
                                                    set.weight :
                                                    (Math.round(parseInt(set.weight) / 2.20462262)).toString()
                                                }
                                            </TableCell> 
                                            <TableCell align="center">{set.reps}</TableCell>
                                            </>
                                            :
                                            <>
                                            <TableCell align="center">
                                                {set.distance}
                                            </TableCell>
                                            <TableCell align="center">
                                                {set.duration}
                                            </TableCell>
                                            </>
                                        } 

                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}

export default ProgressCollapse;