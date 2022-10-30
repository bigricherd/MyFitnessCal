import { useState } from 'react';
import axios from 'axios';

export default function useForm({ initialValues }) {
    const [values, setValues] = useState(initialValues || {});
    const [error, setError] = useState(null);
    const [prevError, setPrevError] = useState(null);
    const [numSets, setNumSets] = useState(null);

    const handleChange = event => {
        const value = event.target.value;
        const name = event.target.name;
        setValues({
            ...values,
            [name]: value
        })

    }

    //submit form when delete button is clicked
    const handleSubmit = event => {
        event.preventDefault();
        submitData({ values });
    };



    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        let { setId, sessionId } = dataObject;
        try {
            await axios({
                method: 'DELETE',
                url: `/api/sessions/set?setId=${setId}&sessionId=${sessionId}`,
                withCredentials: true

            }).then(res => {
                setNumSets(res.data.count);
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
    return ({
        handleChange,
        values,
        numSets,
        handleSubmit,
        error,
        prevError
    })
}