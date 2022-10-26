import { useState } from 'react';
import {
    FormControl,
    Button,
    Table,
    TableRow,
    TableCell,
    TableBody,
    Collapse,
    Box,
    IconButton,
    Stack
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { DoDisturbOnOutlined } from '@mui/icons-material';
import Dropdown from "../Dropdown";
import SetRow from './SetRow';

function AddSetsCollapse(props) {

    const [open, setOpen] = useState(false);

    const [sets, setSets] = useState(props.exercise.sets);

    let setsTemp = sets.slice();
    let exercises = props.exercises.slice();

    const addSet = () => {
        const emptySet = {
            'reps': 0,
            'weight': 0,
            exercise: props.exercise.name || ''
        }

        if (sets.length === 0) {
            exercises[props.index]['sets'] = [emptySet];
            setSets([emptySet]);
        } else {
            setsTemp.push(emptySet);
            exercises[props.index]['sets'] = setsTemp;
            setSets(setsTemp);
        }
        props.setExercises(exercises);
    }

    const handleSetChange = (event) => {
        const name = event.target.name.split("_")[0];
        const index = event.target.name.split("_")[1];

        if (event.target.value >= 0 && event.target.value !== "-0") {
            setsTemp[index][name] = event.target.value;
            exercises[props.index]['sets'] = setsTemp;

            setSets(setsTemp);
            props.setExercises(exercises);
        }
        setsTemp[index][name] = event.target.value;
        exercises[props.index]['sets'] = setsTemp;

        setSets(setsTemp);
        props.setExercises(exercises);
    }

    const removeSet = (i) => {
        let exercises = props.exercises.slice();

        setsTemp = [...setsTemp.slice(0, i), ...setsTemp.slice(i + 1)];
        exercises[props.index]['sets'] = setsTemp;

        setSets(setsTemp);
        props.setExercises(exercises);
    }

    return (
        <>
            {/* Header row, visible at all times */}
            <TableRow>

                {/* Toggle collapse button*/}
                <TableCell sx={{ width: "5%" }}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => {
                            setOpen(!open);
                        }}
                        disabled={!props.exercise.name || props.exercise.name === ""}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>

                {/* Select exercise dropdown */}
                <TableCell>
                    <FormControl fullWidth>
                        <Dropdown
                            id="exercise"
                            options={props.exerciseOptions}
                            name={`exercise_${props.index}`}
                            value={props.exercise.name}
                            onChange={(e) => {
                                props.onChange(e);
                            }}
                        ></Dropdown>
                    </FormControl>
                </TableCell>

                {/* Remove group button */}
                <TableCell>
                    <Button
                        onClick={(e) => { props.onDelete(props.index) }}
                        sx={{ color: "red" }}
                    >
                        <DoDisturbOnOutlined />
                    </Button>
                </TableCell>
            </TableRow>

            {/* Collapse starts here */}
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box alignItems="center" justifyContent="center">
                            <Table>
                                <TableBody>
                                    {
                                        sets && sets.map((set, i) => (
                                            <TableRow key={i}>
                                                <TableCell colSpan={6} align="right">
                                                    < SetRow
                                                        set={set}
                                                        index={i}
                                                        value={sets[i]}
                                                        handleChange={handleSetChange}
                                                        onDelete={removeSet}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>

                        </Box>
                        <Stack
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Button
                                onClick={() => {
                                    if (props.exercise.name.length > 0) {
                                        addSet();
                                    } else {
                                        console.log('Please select an exercise first');
                                        // TODO message: select an exercise first
                                    }
                                }}
                                variant="contained"
                                sx={{
                                    margin: "0.67rem"
                                }}
                            >
                                Add set
                            </Button>
                        </Stack>

                    </Collapse>
                </TableCell>
            </TableRow>



        </>
    )
}

export default AddSetsCollapse;