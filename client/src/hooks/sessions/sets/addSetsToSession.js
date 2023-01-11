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

    const validateInputs = (values) => {
        if (!prevError || (error !== prevError)) {
            setPrevError(error);
        } else {
            setPrevError(null);
        }
        const { sets } = values;
        if (sets && sets.length > 0) {
            return validateSets(sets);
        } else if (sets.length === 0) {
            setError("Please add at least one set.");
            return false;
        }
        return true;
    };

    const validateSets = (sets) => {
        for (let set of sets) {
            if (parseInt(set.reps) <= 0 || set.reps === "") {
                setError("Minimum reps for a set is 1.");
                return false;
            } else if (parseInt(set.weight) < 0 || set.weight === "") {
                setError("Weight cannot be negative.");
                return false;
            }
        };
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
        let { sets, sessionId, date } = dataObject;

        try {
            const homeUrl = process.env.REACT_APP_HOME_URL || "http://localhost:3000";
            await axios({
                method: 'POST',
                url: `/api/sessions/addSets`,
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
                return true;
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

    return ({
        handleChange,
        handleSubmit,
        values,
        setValues,
        numSets,
        error,
        prevError
    })
}