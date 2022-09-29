import { useState } from 'react';
import axios from 'axios';

// ------ This hook is identical to useForm, except it submits the forms in Register and Login components so its values are {username, password} ------
export default function useForm({ initialValues }) {
    const [values, setValues] = useState(initialValues || {});
    const [error, setError] = useState(null);
    const [prevError, setPrevError] = useState(null);
    const [edited, setEdited] = useState(0);

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
        console.log(values);
        submitData({ values });
    };

    const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';

    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        let { sessionId, title, comments, date, startdatetime, enddatetime } = dataObject;

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
                    method: 'PATCH',
                    url: `${baseUrl}/api/sessions/?id=${sessionId}`,
                    data: {
                        title,
                        comments,
                        date,
                        startdatetime,
                        enddatetime,
                        edited
                    },
                    headers: new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' }),
                    withCredentials: true

                }).then(res => {
                    console.log(res.data);
                    setEdited(res.data.count);
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
        handleKeyDown,
        values,
        setValues,
        handleSubmit,
        error,
        prevError,
        edited
    }
}