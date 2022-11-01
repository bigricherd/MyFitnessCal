import { useState } from "react";
import axios from "axios";

export default function useForm({ initialValues, timezones, setTimezone }) {
    const [values, setValues] = useState(initialValues || {});

    // Feedback
    const [success, setSuccess] = useState(null);
    const [prevSuccess, setPrevSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [prevError, setPrevError] = useState(null);

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
            handleSubmit(event);
        }
    };

    const validateInputs = (values) => {
        console.log(values.timezone);
        if (timezones.indexOf(values.timezone) === -1) {
            setError("Invalid time zone.");
            return false;
        }
        return true;
    }

    //submit form when submit button is clicked
    const handleSubmit = event => {
        event.preventDefault();
        if (validateInputs(values)) {
            console.log('valid tz');
            console.log(values);
            submitData({ values });
        }
    };

    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        let { timezone, userId } = dataObject;

        try {
            await axios({
                method: 'PATCH',
                url: `/api/auth/timezone`,
                data: {
                    timezone,
                    userId
                },
                headers: new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' }),
                withCredentials: true
            }).then(res => {
                if (!prevSuccess || (success !== prevSuccess)) {
                    setPrevSuccess(success);
                } else {
                    setPrevSuccess(null);
                }
                setSuccess(res.data.success);
                setTimezone(res.data.timezone);
                setError(null);
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
        values,
        handleChange,
        handleKeyDown,
        handleSubmit,
        success,
        prevSuccess,
        error,
        prevError
    }
}