import React, { useEffect, useState } from 'react';
import useForm from '../hooks/useForm';
import Dropdown from './Dropdown';
import formatEnum from '../helpers/formatEnum';
import Message from './Message';

function AddSet() {

    let exercisesArr = [];
    let muscleGroupsArr = [];

    const [exercises, setExercises] = useState([]);

    const start = async () => {
        const baseUrl = 'http://localhost:5000';
        const data = await fetch(`${baseUrl}/api/enums`);
        const json = await data.json();
        //console.log(json);
        exercisesArr = formatEnum(json.exercises);
        muscleGroupsArr = formatEnum(json.muscleGroups);
        setExercises(exercisesArr);
        console.log(exercisesArr);
        console.log(muscleGroupsArr);
    }

    useEffect(() => {
        start();
    }, [])

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

        // Clear values fields. Without this, input fields will clear on submit but revert to previous contents on next change
        values.reps = '';
        values.weight = '';
        values.date = '';
        values.exercise = '';
        values.comments = '';
    }

    return (
        <div>
            <h2 className="display-3 mt-3">Add Set</h2>
            <form action="#" method="POST" onSubmit={customHandleSubmit}>

                <div className="mb-3 text-start">
                    <label htmlFor="reps" className='form-label'>Reps</label>
                    <input type="number" className="form-control" placeholder="reps" id="reps" name="reps" value={values.reps} onChange={handleChange} onKeyDown={handleKeyDown} required />
                </div>

                <div className="mb-3 text-start">
                    <label htmlFor="weight" className='form-label'>Weight (lb)</label>
                    <input type="number" className="form-control" placeholder="0" id="weight" name="weight" value={values.weight} onChange={handleChange} onKeyDown={handleKeyDown} required />
                </div>

                <div className="mb-3 text-start">
                    <label htmlFor="date" className='form-label'>Date (yyyy-mm-dd)</label>
                    <input type="text" className="form-control" placeholder="" id="date" name="date" value={values.date} onChange={handleChange} onKeyDown={handleKeyDown} required />
                </div>

                <div className="mb-3 text-start">
                    <label htmlFor="exercise" className='form-label d-block'>Exercise</label>
                    <Dropdown name={'exercise'} id={'exercise'} options={exercises} value={values.exercise} onChange={handleChange} onKeyDown={handleKeyDown} />

                    {/* see AddExercise.jsx line 74 for a note on this input */}
                    <input type="text" className="form-control d-none" placeholder="" id="exercise" name="exercise" value={values.exercise} onChange={handleChange} onKeyDown={handleKeyDown} required />
                </div>

                <div className="mb-3 text-start">
                    <label htmlFor="comments" className='form-label'>Comments</label>
                    <textarea name="comments" id="comments" cols="20" rows="5" className='form-control' value={values.comments} onChange={handleChange} onKeyDown={handleKeyDown}></textarea>
                </div>

                <button className="btn btn-primary mb-3">Add set</button>
            </form>
            {successMsg && <Message success={successMsg} />}
        </div>
    )
}

export default AddSet;