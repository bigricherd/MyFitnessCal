import { useState } from 'react';
import axios from 'axios';

// ------ This hook is identical to useForm, except it submits the forms in Register and Login components so its values are {username, password} ------
export default function useForm({ initialValues }) {
    const [values, setValues] = useState(initialValues || {});
    const [error, setError] = useState(null);
    const [prevError, setPrevError] = useState(null);
    const [numSessions, setNumSessions] = useState(null);

    //track form values
    const handleChange = event => {
        const value = event.target.value;
        const name = event.target.name;
        setValues({
            ...values,
            [name]: value
        });
        console.log(values);
    };

    const handleSetChange = event => {
        console.log('set value changed');
        const value = event.target.value;
        const name = event.target.name.split("_")[0];
        const index = event.target.name.split("_")[1];

        const setsTemp = values.sets;
        setsTemp[index][name] = value;
        setValues({
            ...values,
            sets: setsTemp
        });
        console.log(index);
        console.log(values);
    }

    //submit form when enter key is pressed
    const handleKeyDown = event => {
        const enter = 13;
        if (event.keyCode === enter) {
            handleSubmit(event);
        }
    }

    //submit form when submit button is clicked
    const handleSubmit = event => {
        event.preventDefault();
        submitData({ values });
    };

    const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';

    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        let { title, comments, date, startdatetime, enddatetime, sets } = dataObject;

        // Sets start and end times to be on the selected date; necessary because it defaults to today.
        startdatetime.setDate(date.getDate());
        enddatetime.setDate(date.getDate());
        if (title === '') {
            if (!prevError || (error !== prevError)) {
                setPrevError(error);
            } else {
                setPrevError(null);
            }
            setError('Title cannot be blank');
        } else {
            try {
                await axios({
                    method: 'POST',
                    url: `${baseUrl}/api/sessions/add`,
                    data: {
                        title,
                        comments,
                        date,
                        startdatetime,
                        enddatetime,
                        sets
                    },
                    headers: new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' }),
                    withCredentials: true

                }).then(res => {
                    setNumSessions(res.data.count);
                    setError(null);
                })
            } catch (err) {
                console.log(err);
                if (!prevError || (error !== prevError)) {
                    setPrevError(error);
                } else {
                    setPrevError(null);
                }
                setError(err.response.data.message);
            }
        }

    };
    return {
        handleChange,
        handleSetChange,
        handleKeyDown,
        values,
        setValues,
        handleSubmit,
        error,
        prevError,
        numSessions
    }
}