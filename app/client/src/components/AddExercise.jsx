import React, { useState, useEffect } from 'react';
import useForm from '../hooks/useForm';
import Dropdown from './Dropdown';
import formatEnum from '../helpers/formatEnum';
import Message from './Message';
//import Table from './Table'; // Data display, but I didn't want to go too far.

function AddExercise() {
    let exercisesArr = [];
    let muscleGroupsArr = [];

    const [muscleGroups, setMuscleGroups] = useState([]);
    // const [tableData, setTableData] = useState([]); 

    const start = async () => {
        const baseUrl = 'http://localhost:5000';
        const data = await fetch(`${baseUrl}/api/enums`);
        const json = await data.json();
        exercisesArr = formatEnum(json.exercises);
        muscleGroupsArr = formatEnum(json.muscleGroups);
        setMuscleGroups(muscleGroupsArr);
        console.log(exercisesArr);
        console.log(muscleGroupsArr);
    }

    useEffect(() => {
        start();
    }, [])

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

    // More data display stuff
    // const fetchAllSets = async (e) => {
    //     const res = await fetch('/api/sets/all');
    //     const data = await res.json();
    //     setTableData(data);
    //     console.log(data);
    // }

    return (
        <div>
            <h2 className="display-3 mt-3">Add Exercise</h2>
            <form action="#" onSubmit={customHandleSubmit}>
                <div className="mb-3 text-start">
                    <label htmlFor="exercise" className='form-label'>Name</label>
                    <input type="text" className="form-control" placeholder="" id="exercise" name="exercise" value={values.exercise} onChange={handleChange} onKeyDown={handleKeyDown} required />
                </div>

                <div className="mb-3 text-start">
                    <label htmlFor="muscleGroup" className='form-label d-block'>Muscle Group</label>
                    <Dropdown name={'muscleGroup'} id={'muscleGroup'} options={muscleGroups} value={values.muscleGroup} onChange={handleChange} onKeyDown={handleKeyDown} />

                    {/* the dropdown does not work if this hidden input is removed. 
                    I guess the dropdown works as a setter but the form takes the value from this input element*/}
                    <input type="text" className="form-control d-none" placeholder="" id="muscleGroup" name="muscleGroup" value={values.muscleGroup} onChange={handleChange} onKeyDown={handleKeyDown} />
                </div>
                <button className="btn btn-primary mb-3">Add exercise</button>

                {/* Data display
             <div>
                <button className="btn btn-light" type='button' onClick={fetchAllSets}>Print all sets to console</button>
                <Table data={tableData} />
            </div> */}

            </form>
            {successMsg && <Message success={successMsg} />}
        </div>
    )
}

export default AddExercise;