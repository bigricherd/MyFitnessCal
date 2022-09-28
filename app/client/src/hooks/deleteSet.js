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

    const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';

    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        let { setId, sessionId } = dataObject;
        try {
            await axios({
                method: 'DELETE',
                url: `${baseUrl}/api/sessions/set`,
                data: {
                    setId,
                    sessionId
                },
                headers: new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' }),
                withCredentials: true

            }).then(res => {
                console.log(res.data.count);
                setNumSets(res.data.count);
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
        values,
        numSets,
        handleSubmit
    })
}