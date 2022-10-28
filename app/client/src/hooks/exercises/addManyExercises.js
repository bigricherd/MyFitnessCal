import { useState } from "react";
import axios from "axios";

// ------ Custom form control: submits AddSet and AddExercise forms and redirects to home if successful or login if unsuccessful ------
export default function useForm({ initialValues, muscleGroups = [], setExercises, setCount }) {
    const [values, setValues] = useState(initialValues || {});
    const [error, setError] = useState(null);
    const [prevError, setPrevError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [prevSuccessMsg, setPrevSuccessMsg] = useState(null);
    const [firstVisit, setFirstVisit] = useState(true);
    //const [count, setCount] = useState(0);

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

    const validateExercises = (exercises) => {
        if (exercises.length === 0) {
            setError("Please add at least one exercise.");
            return false;
        }
        for (let exercise of exercises) {
            let name = exercise.split(":")[0];
            let muscleGroup = exercise.split(":")[1];
            if (name === "" || muscleGroup === "") {
                setError("Please fill out empty fields.");
                return false;
            } else if (muscleGroups.indexOf(muscleGroup) === -1) {
                setError("Invalid muscle group. Please try again.");
                return false;
            } else if (name.length > 25) {
                setError("Exercise name is too long, limit: 25 characters. Consider using acronyms like 'BB' or 'OH.'");
                return false;
            }
        }
        return true;
    };

    const validateInputs = (values) => {
        if (!prevError || (error !== prevError)) {
            setPrevError(error);
        } else {
            setPrevError(null);
        }
        const { exercises } = values;
        console.log(exercises);

        return validateExercises(exercises);
    };

    //submit form when submit button is clicked
    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateInputs(values)) {
            submitData({ values });
        }
    };

    const baseUrl = process.env.REACT_APP_HOME_URL || "http://localhost:5000";

    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        const { exercises } = dataObject;
        try {
            await axios({
                method: "POST",
                url: `${baseUrl}/api/exercises/addMany`,
                data: {
                    exercises,
                },
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                }),
                withCredentials: true,
            }).then((res) => {

                if (!prevSuccessMsg || (successMsg !== prevSuccessMsg)) {
                    setPrevSuccessMsg(successMsg);
                } else {
                    setPrevSuccessMsg(null);
                }
                setSuccessMsg(res.data.message);
                setCount(res.data.count);
                setFirstVisit(res.data.firstVisit);
                setError(null);
            });
        } catch (err) {
            console.log(err);
            if (!prevError || (error !== prevError)) {
                setPrevError(error);
            } else {
                setPrevError(null);
            }
            setExercises([]);
            setError(err.response.data.message);
        }
    };
    return {
        values,
        handleSubmit,
        error,
        prevError,
        successMsg,
        prevSuccessMsg,
        firstVisit
    };
}
