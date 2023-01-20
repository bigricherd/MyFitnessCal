import { useState } from "react"
import { isBefore } from 'date-fns';

// ------ This hook submits the forms in the MuscleGroupFilter component with a GET reqyest; its values are {fromDate, toDate} ------
// form values are passed in the query string as they do not contain sensitive information, simply user selections of the filters
export default function useForm({ initialValues, muscleGroups }) {
    const [values, setValues] = useState(initialValues || {});
    const [error, setError] = useState(null);
    const [prevError, setPrevError] = useState(null);
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

    const validateInputs = (values) => {
        if (!prevError || (error !== prevError)) {
            setPrevError(error);
        } else {
            setPrevError(null);
        }
        const { muscleGroup, fromDate, toDate } = values;

        // Empty fields
        if (muscleGroup === "" || !fromDate || !toDate) {
            setError("Please fill out empty fields.");
            return false;
        }
        // End time <= start time
        else if (isBefore(toDate, fromDate)) {
            setError("Please provide a valid date range.");
            return false;
        }
        // Invalid muscle group
        else if (muscleGroups.indexOf(muscleGroup) === -1) {
            setError("Invalid muscle group.");
            return false;
        }

        return true;
    };

    //submit form when submit button is clicked
    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateInputs(values)) {
            submitData({ values });
        }
    };

    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        const { fromDate, toDate, muscleGroup } = dataObject;
        // Notice that this hook is different in that it uses a GET request, not POST like Register, Login, AddSet, and AddExercise
        // We no longer need the 'data' attribute in the axios config object
        // Instead we pass filter parameters through the query string and they are read on the backend through req.query
        try {
            const res = await fetch(`/api/stats/setsPerMuscle?fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}&muscleGroup=${muscleGroup}`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            const data = await res.json();
            setResponse(data);

            if (data.redirect === "/") {
                window.location = "/";
            } else if (data.redirect === "/login") {
                window.location = "/login";
            }
            setError(null);
        } catch (err) {
            // Handles identical, consecutive errors (else block)
            if (!prevError || (error !== prevError)) {
                setPrevError(error);
            } else {
                setPrevError(null);
            }

            // Extra line of defense in case empty dates somehow get past validateInputs() above
            if (err.message &&
                (err.message === "Cannot read properties of undefined (reading 'toISOString')"
                    || err.message === "Cannot read properties of null (reading 'toISOString')")
            ) {
                setError("Please select dates.");
            } else {
                setError(err.response.data.message);
            }
        }
    };
    return {
        handleChange,
        handleKeyDown,
        values,
        handleSubmit,
        error,
        prevError,
        response
    };
}
