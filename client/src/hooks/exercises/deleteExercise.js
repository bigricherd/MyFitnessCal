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

    //submit form when submit button is clicked
    const handleSubmit = event => {
        event.preventDefault();
        submitData({ values });
    };

    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        let { exercise } = dataObject;

        try {
            const homeUrl = process.env.REACT_APP_HOME_URL || "http://localhost:3000";
            await axios({
                method: 'DELETE',
                url: `${homeUrl}/api/exercises/?nameandmusclegroup=${exercise}`,
                withCredentials: true

            }).then(res => {
                setExercisesPostDelete(res.data.exercises);
                if (!prevSuccessMsg || (prevSuccessMsg !== successMsg)) {
                    setPrevSuccessMsg(successMsg);
                } else {
                    setPrevSuccessMsg(null);
                }
                setSuccessMsg(res.data.message);
            })
        } catch (err) {
            if (!prevError || (error !== prevError)) {
                setPrevError(error);
            } else {
                setPrevError(null);
            }
            setError(err.response.data.message);
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