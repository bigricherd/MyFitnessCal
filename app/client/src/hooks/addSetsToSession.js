import { useState } from 'react';
import axios from 'axios';

export default function useForm({ initialValues }) {
    const [values, setValues] = useState(initialValues || {});
    const [numSets, setNumSets] = useState(null);
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

    const handleSetChange = event => {
        const value = event.target.value;
        const name = event.target.name.split("_")[0];
        const index = event.target.name.split("_")[1];

        const setsTemp = values.sets;
        setsTemp[index][name] = value;
        setValues({
            ...values,
            sets: setsTemp
        });
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
        let { sets, sessionId, date } = dataObject;

        // Sets start and end times to be on the selected date; necessary because it defaults to today.
        try {
            await axios({
                method: 'POST',
                url: `${baseUrl}/api/sessions/addSets`,
                data: {
                    sets,
                    sessionId,
                    date
                },
                headers: new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' }),
                withCredentials: true

            }).then(res => {
                setNumSets(res.data.numSets);
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

    };

    return ({
        handleChange,
        handleSetChange,
        handleSubmit,
        values,
        setValues,
        numSets,
        error,
        prevError
    })
}