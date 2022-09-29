import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid
} from '@mui/material';
import addSetsToSession from '../../hooks/addSetsToSession';
import { useEffect } from 'react';
import SetRow from '../forms/SetRow';
import { formatDateHyphens } from '../../helpers/formatDate';


function AddSetsToSessionPopup(props) {

    const [sets, setSets] = useState([]);

    let setsTemp = sets.slice();

    const addSet = () => {
        const emptySet = {
            'reps': 0,
            'weight': 0,

            exercise: ''
        }
        if (sets.length === 0) {
            setSets([emptySet]);
            values.sets = [emptySet];
        } else {
            setsTemp.push(emptySet);
            setSets(setsTemp);
            values.sets = setsTemp;
        }
    }

    const removeSet = (i) => {
        setsTemp = [...setsTemp.slice(0, i), ...setsTemp.slice(i + 1)];
        setSets(setsTemp);
        values.sets = setsTemp;
    }

    const resetFormFields = () => {
        setValues({
            sets: sets,
            sessionId: props.session ? props.session.id : null,
            date: props.session ? formatDateHyphens(props.session.date) : null
        });
        setSets([]);
    }

    const { handleSetChange, handleSubmit, values, setValues, numSets, error, prevError } = addSetsToSession({
        initialValues: {
            sets,
            sessionId: props.session ? props.session.id : null,
            date: props.session ? formatDateHyphens(props.session.date) : null
        }
    });

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
                    {/* on click: add a new form row  */}
                    <Button
                        type="submit"
                        onClick={addSet}
                        variant="contained"
                    >
                        Add set
                    </Button>

                    {/* Rows of sets to be added */}
                    <Grid container>
                        {sets.map((set, i) => (
                            <Grid item xs={12} key={i}>
                                <SetRow set={set} index={i} value={values.sets[i]} handleChange={handleSetChange} onDelete={removeSet} exercises={props.exercises} />
                            </Grid>
                        ))}
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
                            handleSubmit(e);
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