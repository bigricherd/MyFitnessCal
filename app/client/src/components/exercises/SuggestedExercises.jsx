import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';
import ShowSelectedPopup from './ShowSelectedPopup';
import addManyExercises from '../../hooks/exercises/addManyExercises';
import formatExercise from '../../helpers/formatExercise';

const exerciseOptions = ["bb_bench_press:chest", "incline_db_press:chest", "dips:chest", "bb_oh_press:shoulders", "db_oh_press:shoulders", "db_lateral_raise:shoulders",
    "lat_pulldown:lats", "bb_row:lats", "seated_cable_row:lats", "bb_shrug:traps", "neck_curl:neck", "neck_extension:neck", "back_extension:lower_back", "db_curl:biceps", "bb_curl:biceps",
    "cable_tricep_pushdown:triceps", "lying_db_skullcrusher:triceps", "bb_back_squat:quads", "leg_extension:quads", "bb_romanian_deadlift:hamstrings", "hamstring_curl:hamstrings",
    "bb_hip_thrust:glutes", "standing_calf_raise:calves", "seated_calf_raise:calves", "sit_up:abs", "lying_leg_raise:abs"];

function SuggestedExercises(props) {
    const [options, setOptions] = useState(exerciseOptions.slice());
    const [exercises, setExercises] = useState([]);

    // Filter options: remove those in exercisesByUser
    useEffect(() => {
        let tmp = options.slice();
        tmp = tmp.filter((item) => (
            props.exercisesByUser.indexOf(item) === -1
        ));
        setOptions(tmp);
    }, [props.exercisesByUser]);

    const { values, handleSubmit, error, prevError, successMsg, prevSuccessMsg, firstVisit, count } = addManyExercises({
        initialValues: {
            exercises: []
        },
        muscleGroups: props.muscleGroups,
        setExercises,
        setCount: props.setCount
    });

    let heading = "";
    let backButtonText = "";
    if (props.parent === "sessions") {
        heading = `Welcome to MyFitnessCal, ${props.user}! Add some exercises to get started.`;
        backButtonText = "Skip"
    } else if (props.parent === "exercises") {
        heading = "Suggested exercises";
        backButtonText = "back"
    }

    // Setup to show feedback message -- error
    const [showError, setShowError] = useState(false);
    const handleCloseError = () => { setShowError(false); }

    useEffect(() => {
        if (error) {
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 4000)
        }
    }, [error, prevError]);

    // UPDATE values.exercises every time the state variable changes
    useEffect(() => {
        values.exercises = exercises;
    }, [exercises]);

    // SETTING SUCCESS MESSAGE IN PARENT (SessionsPage or ExercisesPage)
    useEffect(() => {
        props.setSuccessMsg(successMsg);
        props.setPrevSuccessMsg(prevSuccessMsg);
        props.setShow(false);
        setExercises([]);
    }, [successMsg, prevSuccessMsg]);

    // FOR SESSIONS VERSION
    useEffect(() => {
        if (!firstVisit) {
            props.setFirstVisit(firstVisit);
            setExercises([]);
        }
    }, [firstVisit]);

    // FOR EXERCISES VERSION
    useEffect(() => {
        props.setCount(count);
        setExercises([]);
    }, [count]);

    const [showSelectedPopup, setShowSelectedPopup] = useState(false);

    return (
        <>
            <Dialog open={props.open}>
                <DialogTitle>
                    {heading}
                </DialogTitle>


                <DialogContent>
                    {/* Styles good */}
                    {error && showError && < Alert severity="error" onClose={handleCloseError}>{error}</Alert>}
                    <TableContainer >
                        {/* The smaller the maxWidth (in percent) of the TableContainer above, the more the content scrolls horizontally -- mobile only */}
                        <Table>
                            <TableHead>
                                <TableRow sx={{
                                    position: "sticky"
                                }}>
                                    <TableCell>
                                        Exercise
                                    </TableCell>
                                    <TableCell>
                                        Muscle Group
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => { setShowSelectedPopup(true) }}
                                        >
                                            Selected
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {options && options.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            {formatExercise(item.split(":")[0])}
                                        </TableCell>
                                        <TableCell>
                                            {formatExercise(item.split(":")[1])}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => {
                                                    // Append to exercises
                                                    let item = options[index];
                                                    let tmp = exercises.slice();
                                                    tmp.push(item);
                                                    setExercises(tmp);

                                                    // Remove from options
                                                    let tmp2 = options.slice();
                                                    tmp2 = [...tmp2.slice(0, index), ...tmp2.slice(index + 1)];
                                                    setOptions(tmp2);
                                                }}
                                            >
                                                <Add />
                                            </Button>
                                        </TableCell>
                                    </ TableRow >
                                ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <ShowSelectedPopup
                        open={showSelectedPopup}
                        onClose={() => { setShowSelectedPopup(false) }}
                        exercises={exercises}
                        setExercises={setExercises}
                        options={options}
                        setOptions={setOptions}
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={props.onClose}
                    >
                        {backButtonText}
                    </Button>

                    <Button
                        onClick={(e) => {
                            handleSubmit(e);
                        }}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default SuggestedExercises;