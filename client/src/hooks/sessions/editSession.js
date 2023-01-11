import { useState } from 'react';
import axios from 'axios';
import { isAfter, isEqual } from 'date-fns';

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
    };

    //submit form when enter key is pressed
    const handleKeyDown = event => {
        const enter = 13;
        if (event.keyCode === enter) {
            return handleSubmit(event);
        }
    };

    // Form validation
    const validateInputs = (values) => {
        if (!prevError || (error !== prevError)) {
            setPrevError(error);
        } else {
            setPrevError(null);
        }
        const { title, date, startdatetime, enddatetime, comments } = values;
        if (title === "" || !date || !startdatetime || !enddatetime) {
            setError("Please fill out required fields.");
            return false;
        } else if (title.length > 35) {
            setError("Maximum title length is 35 characters.");
            return false;
        } else if (comments.length > 40) {
            setError("Maximum comments length is 40 characters.");
        } else if (startdatetime && enddatetime) {
            startdatetime.setDate(date.getDate());
            enddatetime.setDate(date.getDate());
            if (isAfter(startdatetime, enddatetime) || isEqual(startdatetime, enddatetime)) {
                setError("End time must come after start time.");
                return false;
            }
        }
        return true;
    };

    //submit form when submit button is clicked
    const handleSubmit = event => {
        event.preventDefault();
        if (validateInputs(values)) {
            return submitData({ values });
        }
        return false;
    };



    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        let { sessionId, title, comments, date, startdatetime, enddatetime } = dataObject;

        try {
            // Sets start and end times to be on the selected date; necessary because it defaults to today.
            startdatetime.setDate(date.getDate());
            enddatetime.setDate(date.getDate());

            startdatetime.setMonth(date.getMonth());
            enddatetime.setMonth(date.getMonth());

            startdatetime.setFullYear(date.getFullYear());
            enddatetime.setFullYear(date.getFullYear());
            
            const homeUrl = process.env.REACT_APP_HOME_URL || "http://localhost:3000";
            await axios({
                method: 'PATCH',
                url: `/api/sessions/?id=${sessionId}`,
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
                setEdited(res.data.count);
                setError(null);
                return true;
            })
        } catch (err) {

            if (!prevError || (error !== prevError)) {
                setPrevError(error);
            } else {
                setPrevError(null);
            }
            // Extra line of defense in case empty date / times somehow get past validateInputs() above
            if (err.message && err.message === "date.getDate is not a function") {
                setError("Please enter a date, start time, and end time.");
            } else {
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