import { useState } from "react";
import axios from "axios";

// ------ This hook submits the forms in the MuscleGroupFilter component with a GET reqyest; its values are {fromDate, toDate} ------
// form values are passed in the query string as they do not contain sensitive information, simply user selections of the filters
export default function useForm({ initialValues, slug }) {
    const [values, setValues] = useState(initialValues || {});
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    //track form values
    const handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        setValues({
            ...values,
            [name]: value,
        });
        console.log(values);
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
        submitData({ values });
    };

    const baseUrl = process.env.REACT_APP_HOME_URL || "http://localhost:5000";

    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        const { fromDate, toDate, muscleGroup } = dataObject;
        // Notice that this hook is different in that it uses a GET request, not POST like Register, Login, AddSet, and AddExercise
        // We no longer need the 'data' attribute in the axios config object
        // Instead we pass filter parameters through the query string and they are read on the backend through req.query
        try {
            await axios({
                method: "GET",
                url: `${baseUrl}/${slug}?fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}&muscleGroup=${muscleGroup}`,
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                }),
                withCredentials: true,
            }).then((res) => {
                console.log(res.data);
                const results = res.data.results;
                console.log(Object.entries(results));
                //console.log(res.data.perExercise);
                //console.log(Object.values(results));
                setData(res.data);
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
        data,
    };
}
