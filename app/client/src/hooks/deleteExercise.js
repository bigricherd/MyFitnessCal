import { useState } from 'react';
import axios from 'axios';

// ------ Custom form control: submits AddSet and AddExercise forms and redirects to home if successful or login if unsuccessful ------
export default function useForm({ initialValues }) {
    const [values, setValues] = useState(initialValues || {});
    const [error, setError] = useState(null);
    const [prevError, setPrevError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [prevSuccessMsg, setPrevSuccessMsg] = useState(null);
    const [exercisesPostDelete, setExercisesPostDelete] = useState([]);

    //track form values
    const handleChange = event => {
        const value = event.target.value;
        const name = event.target.name;
        setValues({
            ...values,
            [name]: value
        });
    };

    // //submit form when enter key is pressed
    // const handleKeyDown = event => {
    //     const enter = 13;
    //     if (event.keyCode === enter) {
    //         handleSubmit(event);
    //     }
    // }

    //submit form when submit button is clicked
    const handleSubmit = event => {
        event.preventDefault();
        submitData({ values });
    };

    const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';

    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        let { exercise } = dataObject;

        // Format to match db strings
        // exercise = exercise.toLowerCase();
        // exercise = exercise.toString();
        // exercise = exercise.split(' ').join('_');

        try {
            await axios({
                method: 'DELETE',
                url: `${baseUrl}/api/exercises/?nameandmusclegroup=${exercise}`,
                headers: new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' }),
                withCredentials: true

            }).then(res => {
                console.log(res.data);
                // const exercisesFormatted = formatEnum(res.data.exercises);
                setExercisesPostDelete(res.data.exercises);
                if (!prevSuccessMsg || (prevSuccessMsg !== successMsg)) {
                    setPrevSuccessMsg(successMsg);
                } else {
                    setPrevSuccessMsg(null);
                }
                setSuccessMsg(res.data.message);
            })
        } catch (err) {
            console.log(err);
            if (!prevError || (error !== prevError)) {
                setPrevError(error);
            } else {
                setPrevError(null);
            }
            setError(err.response.data);
        }
    };
    return {
        handleChange,
        values,
        handleSubmit,
        error,
        prevError,
        successMsg,
        prevSuccessMsg,
        exercisesPostDelete
    }
}