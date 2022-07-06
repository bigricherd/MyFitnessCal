import React, { useState, useEffect } from 'react';
import useForm from '../../hooks/useForm';
import Dropdown from '../Dropdown';
import Message from '../Message';
import handleDeleteExercise from '../../hooks/deleteExercise';
import { Button, ListGroup } from 'react-bootstrap';
import formatEnum from '../../helpers/formatEnum';
//import Table from './Table'; // Data display, but I didn't want to go too far.

function AddExercise(props) {
    const [muscleGroups, setMuscleGroups] = useState(props.muscleGroups);
    const [exercisesByUser, setExercisesByUser] = useState(props.exercisesByUser);

    const liftState = (val) => {
        props.liftState(val);
    }

    // const showDeleteArr = [];
    // for (let i = 0; i < props.exercisesByUser.length; i++) {
    //     showDeleteArr.push(false);
    // }
    // const [showDeleteOption, setShowDeleteOption] = useState(showDeleteArr);
    // console.log(showDeleteArr);

    const onDeleteClick = (e, index) => {
        e.persist();
        const postDel = handleDeleteExercise(exercisesByUser[index]);
        console.log(postDel);
        setExercisesByUser(postDel);

        // trying to lift state into Forms to force re-render, but we get the error props.exercisesByUser.map (useState below)
        // is not a function. Maybe it's because postDel is an object, not an array; will continue to troubleshoot.
        // For now, user must navigate to another page (Filters) and back to Forms and AddExercise to see changes.
        //liftState(postDel);
    }

    const [list, setList] = useState(props.exercisesByUser.map((item, index) =>
        <div key={index} className="row manageExercisesListItem">
            <ListGroup.Item className="col-9 col-md-10">{item}
            </ListGroup.Item>
            <Button className="col-3 col-md-2 text-center" variant="danger" size="sm" onClick={(e) => onDeleteClick(e, index)}>X</Button>
        </div>
    ));

    // Update state every time props changes, i.e., when muscleGroups in Forms.jsx changes
    useEffect(() => {
        setMuscleGroups(props.muscleGroups);
        setExercisesByUser(props.exercisesByUser);
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
        <div>

            Add exercise form
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

                </form>
                {successMsg && <Message success={successMsg} />}
            </div>

            Manage exercises -- add edit and delete buttons per item
            <div>

                <ListGroup className="manageExercisesList">
                    {list}
                </ListGroup>

            </div>

        </div>
    )
}

export default AddExercise;