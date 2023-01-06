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
        const regex = /(?=^.{6,}$)(?=.*\d)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
        if (values.newPassword === "" || values.oldPassword === "") {
            setError("Please fill out empty fields.")
            return false;
        }
        // else if (!regex.test(values.newPassword)) {
        //     setError("Password is not strong enough.");
        //     return false;
        // }
        return true;
    }

    //submit form when submit button is clicked
    const handleSubmit = event => {
        event.preventDefault();
        if (validateInputs(values)) {
            console.log('valid pass');
            console.log(values);
            submitData({ values });
        }
    };

    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        let { userId, oldPassword, newPassword } = dataObject;

        try {
            const homeUrl = process.env.REACT_APP_HOME_URL || "http://localhost:3000";
            await axios({
                method: 'PATCH',
                url: `${homeUrl}/api/auth/keyChange`,
                data: {
                    userId,
                    oldPassword,
                    newPassword
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