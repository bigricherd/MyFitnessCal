import React, { useState, useEffect } from 'react';
import handleDeleteExercise from '../hooks/deleteExercise';
import { Button, ListGroup } from 'react-bootstrap';
import formatEnum from '../helpers/formatEnum';

function ManageExercisesList(props) {
    const [exercisesByUser, setExercisesByUser] = useState(props.exercisesByUser);
    let message = null;

    const liftState = (val) => {
        props.liftState(val);
    }

    // const showDeleteArr = [];
    // for (let i = 0; i < props.exercisesByUser.length; i++) {
    //     showDeleteArr.push(false);
    // }
    // const [showDeleteOption, setShowDeleteOption] = useState(showDeleteArr);
    // console.log(showDeleteArr);

    const onDeleteClick = async (e, index) => {
        e.persist();
        console.log(props.exercisesByUser[index]);
        const { postDel, msg } = handleDeleteExercise(props.exercisesByUser[index]);
        // Both postDel and msg are currently coming back undefined
        console.log(postDel);
        console.log(msg);
        message = msg;
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

    useEffect(() => {
        setList(props.exercisesByUser.map((item, index) =>
            <div key={index} className="row manageExercisesListItem">
                <ListGroup.Item className="col-9 col-md-10">{item}
                </ListGroup.Item>
                <Button className="col-3 col-md-2 text-center" variant="danger" size="sm" onClick={(e) => onDeleteClick(e, index)}>X</Button>
            </div>
        ))
    }, [props]);

    return (
        <div className="col">
            <h2 className="display-4 mb-3 ">Manage Exercises</h2>
            <ListGroup className="manageExercisesList">
                {list}
            </ListGroup>
            {/**Doesn't show right now */}
            {message}
        </div>
    )
}

export default ManageExercisesList;