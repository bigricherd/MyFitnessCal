import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Table,
    TableBody,
    Alert,
    Stack
} from '@mui/material';
import addSetsToSession from '../../../hooks/sessions/sets/addSetsToSession';
import { useEffect, useState } from 'react';
import AddSetsCollapse from './AddSetsCollapse';
import { formatDateHyphens } from '../../../helpers/formatDate';


function AddSetsToSessionPopup(props) {
    const [exercises, setExercises] = useState([]);

    let exercisesTemp = exercises.slice();

    const addExercise = () => {
        const emptyExercise = {
            name: '',
            sets: []
        };
        // Make sure there are no empty exercises before adding a new one
        for (let exercise of exercises) {
            if (exercise.name === "") return;
        }
        // Add exercise
        if (exercises.length === 0) {
            setExercises([emptyExercise]);
        } else {
            exercisesTemp.push(emptyExercise);
            setExercises(exercisesTemp);
        }
    }

    const removeExercise = (i) => {
        exercisesTemp = [...exercisesTemp.slice(0, i), ...exercisesTemp.slice(i + 1)];
        setExercises(exercisesTemp);
    }

    const handleExerciseChange = (event) => {
        let exists = false;
        for (let exercise of exercises) {
            if (exercise.name === event.target.value) {
                exists = true;
                break;
            }
        }

        // Only change the value if the exercise has not already been selected
        if (!exists) {
            const index = event.target.name.split("_")[1];
            exercisesTemp[index]['name'] = event.target.value;
        }

        setExercises(exercisesTemp);
    }

    const resetFormFields = () => {
        setValues({
            sets: [],
            sessionId: props.session ? props.session.id : null,
            date: props.session ? formatDateHyphens(props.session.date) : null
        });
        setExercises([]);
    }

    const customHandleSubmit = (event) => {
        const allSets = [];
        for (let exercise of exercises) {
            allSets.push(...exercise.sets);
        }
        values.sets = allSets;
        return handleSubmit(event);
    }

    // Hook
    const { handleSubmit, values, setValues, numSets, error, prevError } = addSetsToSession({
        initialValues: {
            sets: [],
            sessionId: props.session ? props.session.id : null,
            date: props.session ? formatDateHyphens(props.session.date) : null,
            units: props.units
        }
    });

    useEffect(() => {
        setValues({
            ...values,
            ["units"]: props.units
        })
    }, [props.units])

    // Lift numSets to SessionData
    useEffect(() => {
        props.liftState(numSets);
    }, [numSets]);

    // Setup to show feedback messages -- error
    const [showError, setShowError] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    }

    useEffect(() => {
        if (error) {
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 4000)
        }
    }, [error, prevError]);

    return (

        <>
            <Dialog open={props.open} >

                <DialogTitle>
                    Add Sets to Session {props.session.title}
                </DialogTitle>

                <DialogContent>
                    {/* Add a new collapse containing SetRows (AddSetsCollapse)  */}
                    <Stack justifyContent="center" alignItems="center">
                        <Button
                            type="submit"
                            onClick={addExercise}
                            variant="outlined"
                            color="primary"
                            sx={{ borderWidth: "2px" }}
                        >
                            Add exercise
                        </Button>
                    </Stack>

                    {/* Sets to be added, grouped by exercise */}
                    <Grid container>
                        <Table>
                            <TableBody>
                                {exercises.map((exercise, index) => (
                                    <AddSetsCollapse
                                        key={index}
                                        exerciseOptions={props.exercisesByUser}
                                        index={index}
                                        exercise={exercise}
                                        exercises={exercises}
                                        setExercises={setExercises}
                                        onChange={handleExerciseChange}
                                        onDelete={removeExercise}
                                        units={props.units}
                                        />
                                ))}
                            </TableBody>
                        </Table>
                    </Grid>

                    {/* Feedback messages */}
                    <Stack justifyContent="center" alignItems="center">
                        {error && showError && <Alert severity="error" onClose={handleCloseError} sx={{ marginTop: '1rem' }}>{error}</Alert>}
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => { props.setOpen(false) }}
                    >
                        Back
                    </Button>
                    <Button
                        variant="outlined"
                        color="success"
                        onClick={(e) => {
                            values.sessionId = props.session.id;
                            if (customHandleSubmit(e)) {
                                props.setOpen(false);
                                resetFormFields();
                            }
                        }}
                        sx={{ borderWidth: "2px" }}
                    >
                        Add Sets
                    </Button>
                </DialogActions>
            </Dialog >
        </>

    )

}

export default AddSetsToSessionPopup;