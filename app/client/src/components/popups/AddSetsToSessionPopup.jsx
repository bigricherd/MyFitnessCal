import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Table,
    TableBody
} from '@mui/material';
import addSetsToSession from '../../hooks/addSetsToSession';
import { useEffect } from 'react';
import SetRow from '../forms/SetRow';
import AddSetsCollapse from '../forms/AddSetsCollapse';
import { formatDateHyphens } from '../../helpers/formatDate';


function AddSetsToSessionPopup(props) {
    const [exercises, setExercises] = useState([]);

    let exercisesTemp = exercises.slice();

    const addExercise = () => {
        const emptyExercise = {
            name: '',
            sets: []
        };
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
            console.log(exercise);
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
        handleSubmit(event);
    }

    // Hook
    const { handleSubmit, values, setValues, numSets, error, prevError } = addSetsToSession({
        initialValues: {
            sets: [],
            sessionId: props.session ? props.session.id : null,
            date: props.session ? formatDateHyphens(props.session.date) : null
        }
    });

    // Lift numSets to SessionData
    useEffect(() => {
        props.liftState(numSets);
    }, [numSets]);

    return (

        <>
            <Dialog open={props.open} >

                <DialogTitle>
                    Add Sets to Session {props.session.title}
                </DialogTitle>

                <DialogContent>
                    {/* Add a new collapse containing SetRows (AddSetsCollapse)  */}
                    <Button
                        type="submit"
                        onClick={addExercise}
                        variant="contained"
                    >
                        Add exercise
                    </Button>

                    {/* Sets to be added, grouped by exercise */}
                    <Grid container>
                        <Table>
                            <TableBody>
                                {exercises.map((exercise, index) => (
                                    <AddSetsCollapse
                                        key={exercise.name}
                                        exerciseOptions={props.exercises}
                                        index={index}
                                        exercise={exercise}
                                        exercises={exercises}
                                        setExercises={setExercises}
                                        onChange={handleExerciseChange}
                                        onDelete={removeExercise} />
                                ))}
                            </TableBody>
                        </Table>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => { props.setOpen(false) }}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={(e) => {
                            values.sessionId = props.session.id;
                            customHandleSubmit(e);
                            props.setOpen(false);
                            resetFormFields();
                        }}
                    >
                        Add Sets
                    </Button>
                </DialogActions>
            </Dialog >
        </>

    )

}

export default AddSetsToSessionPopup;