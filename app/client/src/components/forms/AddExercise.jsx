import React, { useState, useEffect } from 'react';
import useForm from '../../hooks/useForm';
import Dropdown from '../Dropdown';
import Message from '../Message';
import { Input, InputLabel, Button, FormControl } from '@mui/material';

function AddExercise(props) {
    const [muscleGroups, setMuscleGroups] = useState(props.muscleGroups);

    // Update state every time props changes, i.e., when muscleGroups in Forms.jsx changes
    useEffect(() => {
        setMuscleGroups(props.muscleGroups);
    }, [props]);

    const { values, handleChange, handleKeyDown, handleSubmit, successMsg } = useForm({
        initialValues: {
            exercise: '',
            muscleGroup: ''
        },
        slug: 'api/exercises/add'
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
        values.muscleGroup = '';
        values.exercise = '';
    }

    return (
        <div className='col'> {/** TODO: migrate to MUI */}
            <div>
                <h2 className="display-4 mb-3">Add Exercise</h2>
                <form action="#" onSubmit={customHandleSubmit}> {/** TODO: migrate to MUI */}

                    <InputLabel>Name</InputLabel>
                    <Input name='exercise' value={values.exercise} onChange={handleChange} onKeyDown={handleKeyDown} required></Input>

                    {/* <FormControl> */}
                    <InputLabel>Muscle Group</InputLabel>
                    <Dropdown name='muscleGroup' id='muscleGroup' options={muscleGroups} value={values.muscleGroup} onChange={handleChange} onKeyDown={handleKeyDown} />
                    {/* <Input type="text" placeholder="" id="muscleGroup" name="muscleGroup" value={values.muscleGroup} onChange={handleChange} onKeyDown={handleKeyDown} /> */}

                    {/* </FormControl> */}
                    <Button className="mb-3" onClick={customHandleSubmit}>Add exercise</Button>

                </form>
                {successMsg && <Message success={successMsg} />}
            </div>
        </div>

    )
}

export default AddExercise;