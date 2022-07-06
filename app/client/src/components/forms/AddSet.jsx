import React, { useEffect, useState } from 'react';
import useForm from '../../hooks/useForm';
import Dropdown from '../Dropdown';
import Message from '../Message';

function AddSet(props) {
    const [exercises, setExercises] = useState(props.exercises); // TODO: update exercises when a new one is added by AddExercise
    const [exercisesByUser, setExercisesByUser] = useState(props.exercisesByUser);
    const [showByUserOnly, setShowByUserOnly] = useState(false);

    // Update state every time props changes, i.e., when exercises in Forms.jsx changes
    useEffect(() => {
        setExercises(props.exercises);
        setExercisesByUser(props.exercisesByUser)
    }, [props])

    const { values, handleChange, handleKeyDown, handleSubmit, successMsg } = useForm({
        initialValues: {
            reps: 0,
            weight: 0,
            date: '',
            exercise: '',
            muscleGroup: ''
        },
        slug: 'api/sets/add'
    });

    const customHandleSubmit = (e) => {
        handleSubmit(e);
        console.log(e.target);

        // This loop clears all input fields but skips the last element in the array because it is the submit button.
        for (let i = 0; i < e.target.length - 1; i++) {
            const inputField = e.target[i];
            inputField.value = '';
            console.log(inputField);
        }

        // TODO: START HERE FOR DUPLICATING LAST SET -- with a button like "anotha one" or something like that
        // tempValues = {
        //     reps: values.reps,
        //     weight: values.weight,
        //     date: values.date,
        //     exercise: values.exercise,
        // }

        // Clear values fields. Without this, input fields will clear on submit but revert to previous contents on next change
        // values.reps = '';
        // values.weight = '';
        // values.date = '';
        // values.exercise = '';
    }

    const toggleShownExercises = () => {
        setShowByUserOnly(!showByUserOnly);
    }

    return (
        <div>
            <h2 className="display-3 mt-3">Add Set</h2>
            <form action="#" method="POST" onSubmit={handleSubmit}>

                <div className="mb-3 text-start">
                    <label htmlFor="exercise" className='form-label mb-3 me-1'>Exercise</label>
                    <button className="btn btn-primary mx-2" type="button" onClick={toggleShownExercises}>
                        {showByUserOnly ?
                            "Show all"
                            :
                            "Show mine"
                        }
                    </button>

                    {/** We give the user the option to view all exercises in the database or only the ones that they added*/}

                    {showByUserOnly ?
                        <Dropdown name={'exercise'} id={'exercise'} options={exercisesByUser} value={values.exercise} onChange={handleChange} onKeyDown={handleKeyDown} />
                        :
                        <Dropdown name={'exercise'} id={'exercise'} options={exercises} value={values.exercise} onChange={handleChange} onKeyDown={handleKeyDown} />
                    }


                    {/* see AddExercise.jsx line 74 for a note on this input */}
                    <input type="text" className="form-control d-none" placeholder="" id="exercise" name="exercise" value={values.exercise} onChange={handleChange} onKeyDown={handleKeyDown} required />
                </div>

                <div className="mb-3 text-start">
                    <label htmlFor="reps" className='form-label'>Reps</label>
                    <input type="number" className="form-control" placeholder="" id="reps" name="reps" value={values.reps} onChange={handleChange} onKeyDown={handleKeyDown} required />
                </div>

                <div className="mb-3 text-start">
                    <label htmlFor="weight" className='form-label'>Weight (lb)</label>
                    <input type="number" className="form-control" placeholder="" id="weight" name="weight" value={values.weight} onChange={handleChange} onKeyDown={handleKeyDown} required />
                </div>

                <div className="mb-3 text-start">
                    <label htmlFor="date" className='form-label'>Date (yyyy-mm-dd)</label>
                    <input type="text" className="form-control" placeholder="" id="date" name="date" value={values.date} onChange={handleChange} onKeyDown={handleKeyDown} required />
                </div>

                <button className="btn btn-primary mb-3">Add set</button>
            </form>
            {successMsg && <Message success={successMsg} />}
        </div>
    )
}

export default AddSet;