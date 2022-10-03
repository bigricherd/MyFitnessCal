import { useState } from "react";
import axios from "axios";

// ------ This hook submits the forms in the ExerciseProgress component with a GET reqyest; its values are {fromDate, toDate, exercise} ------
// form values are passed in the query string as they do not contain sensitive information, simply user selections of the filters
export default function useForm({ initialValues, slug }) {
    const [values, setValues] = useState(initialValues || {});
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    //track form values
    const handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        setValues({
            ...values,
            [name]: value,
        });
    };

    //submit form when enter key is pressed
    const handleKeyDown = (event) => {
        const enter = 13;
        if (event.keyCode === enter) {
            handleSubmit(event);
        }
    };

    //submit form when submit button is clicked
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(values);
        values.fromDate = values.fromDate || new Date();
        values.toDate = values.toDate || new Date();
        console.log(values);
        submitData({ values });
    };

    const baseUrl = process.env.REACT_APP_HOME_URL || "http://localhost:5000";

    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        let { fromDate, toDate, exercise } = dataObject;

        try {
            await axios({
                method: "GET",
                url: `${baseUrl}/api/stats/setsOfExercise?exercise=${exercise}&fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`,
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                }),
                withCredentials: true,
            }).then((res) => {
                setResponse(res.data);

                if (res.data.redirect === "/") {
                    window.location = "/";
                } else if (res.data.redirect === "/login") {
                    window.location = "/login";
                }

                setError(null);
            });
        } catch (err) {
            console.log(err);
            setError(err.response.data);
        }
    };
    return {
        handleChange,
        handleKeyDown,
        values,
        handleSubmit,
        error,
        response,
    };
}
