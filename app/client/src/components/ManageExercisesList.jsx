import React, { useState, useEffect } from 'react';
import handleDeleteExercise from '../hooks/deleteExercise';
import { ListGroup } from 'react-bootstrap';
import formatEnum from '../helpers/formatEnum';
import { Grid, Button, Box, css, Divider } from '@mui/material';
import useForm from '../hooks/useDeleteForm'

function ManageExercisesList(props) {
    const [exercisesByUser, setExercisesByUser] = useState(props.exercisesByUser);

    const { values, handleSubmit, error, successMsg, exercisesPostDelete } = useForm(
        { exercise: '' }
    )

    const onDeleteClick = async (e, index) => {
        e.persist();
        const source = props.exercisesByUser;
        values.exercise = source[index];
        handleSubmit(e);
        values.exercise = '';
    }

    const [list, setList] = useState(props.exercisesByUser.map((item, index) =>
        <Grid container key={index} className="manageExercisesListItem">
            <Box component={Grid} item xs={9} sm={10} bgcolor={'white'} color={'gray'}>
                {item}
            </Box>

            <Button className="text-center" variant="contained" onClick={(e) => onDeleteClick(e, index)}>
                <Grid item xs={3} sm={2}>X</Grid>
            </Button>

        </Grid >
    ));

    useEffect(() => {
        setList(props.exercisesByUser.map((item, index) => // TODO: make each item and button a row, i.e. grid items whose widths add up to 12
            <Grid container key={index} className="manageExercisesListItem" >
                <Box component={Grid} item xs={9} sm={10} bgcolor={'white'} color={'gray'}>
                    {item}
                </Box>
                <Grid item xs={3} sm={2}>
                    <Button variant="contained" onClick={(e) => onDeleteClick(e, index)}>X</Button>
                </Grid>
            </Grid >
        ));
        setExercisesByUser(props.exercisesByUser);
    }, [props]);

    useEffect(() => {
        console.log(exercisesPostDelete);
        props.liftState(formatEnum(exercisesPostDelete));
    }, [exercisesPostDelete])

    return (
        <Grid item xs={10} sm={8}>
            <h1>Manage Exercises</h1>
            <div className="manageExercisesList">
                {list}
            </div>
            {/**Doesn't show right now */}
            {successMsg && <h3>{successMsg}</h3>}
            {error && <h3>{error}</h3>}
        </Grid>
    )
}

export default ManageExercisesList;