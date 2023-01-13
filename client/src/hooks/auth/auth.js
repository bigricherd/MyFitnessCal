import { useState } from 'react';
import axios from 'axios';

// ------ This hook is identical to useForm, except it submits the forms in Register and Login components so its values are {username, password} ------
export default function useForm({ initialValues, slug, timezones }) {
    const [values, setValues] = useState(initialValues || {});
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
        if (!prevError || (error !== prevError)) {
            setPrevError(error);
        } else {
            setPrevError(null);
        }

        const regex = /(?=^.{6,}$)(?=.*\d)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
        const { username, password, timezone } = values;

        if (username === "" || password === "") {
            setError("Please fill out empty fields.");
            return false;
        }
        else if (username.length > 30) {
            setError("Username is too long. Limit: 30 characters.");
            return false;
        }
        else if (slug === "api/auth/register" && timezone === "") {
            setError("Please fill out empty fields.");
            return false;
        }
        else if (slug === "api/auth/register" && timezones.indexOf(timezone) === -1) {
            setError("Invalid time zone.");
            return false;
        }
        // NOTE PASSWORD STRENGTH REQUIREMENT REMOVED FOR DEVELOPMENT
        // else if (slug === "api/auth/register" && !regex.test(password)) {
        //     setError("Password is not strong enough.");
        //     return false;
        // }

        return true;
    }

    //submit form when submit button is clicked
    const handleSubmit = event => {
        event.preventDefault();
        if (validateInputs(values)) {
            submitData({ values });
        }
    };



    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        const { username, password, timezone } = dataObject;
        try {
            await axios({
                method: 'POST',
                url: `/${slug}`,
                data: {
                    username,
                    password,
                    timezone
                },
                headers: new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' }),
                withCredentials: true

            }).then(res => {
                if (res.data.redirect) {
                    window.location = res.data.redirect;
                }
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
        handleChange,
        handleKeyDown,
        values,
        handleSubmit,
        error,
        prevError
    }
}