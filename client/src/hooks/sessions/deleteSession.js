import { useState } from 'react';
import axios from 'axios';

export default function useForm({ initialValues }) {
    const [deleteValues, setDeleteValues] = useState(initialValues || {});
    const [error, setError] = useState(null);
    const [prevError, setPrevError] = useState(null);
    const [numSessions, setNumSessions] = useState(null);

    const handleChange = event => {
        const value = event.target.value;
        const name = event.target.name;
        setDeleteValues({
            ...deleteValues,
            [name]: value
        })
    }

    //submit form when delete button is clicked
    const handleSubmitDelete = event => {
        event.preventDefault();
        submitData({ deleteValues });
    };



    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.deleteValues;
        let { id } = dataObject;
        try {

            await axios({
                method: 'DELETE',
                url: `/api/sessions/?sessionId=${id}`,
                withCredentials: true

            }).then(res => {
                setNumSessions(res.data.count);
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
        deleteValues,
        numSessions,
        handleSubmitDelete,
        error,
        prevError
    })
}