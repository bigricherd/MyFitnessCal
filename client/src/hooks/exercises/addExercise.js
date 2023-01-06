import { useState } from "react";
import axios from "axios";

// ------ Custom form control: submits AddSet and AddExercise forms and redirects to home if successful or login if unsuccessful ------
export default function useForm({ initialValues, muscleGroups }) {
    const [values, setValues] = useState(initialValues || {});
    const [error, setError] = useState(null);
    const [prevError, setPrevError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [prevSuccessMsg, setPrevSuccessMsg] = useState(null);
    const [exercisesPostAdd, setExercisesPostAdd] = useState([]);

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
        const { exercise, muscleGroup } = values;
        if (exercise === "" || muscleGroup === "") {
            setError("Please fill out empty fields.");
            return false;
        } else if (muscleGroups.indexOf(muscleGroup) === -1) {
            setError("Invalid muscle group. Please try again.");
            return false;
        } else if (exercise.length > 25) {
            setError("Exercise name is too long, limit: 25 characters. Consider using acronyms like 'BB' or 'OH.'");
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
        const { exercise, muscleGroup } = dataObject;
        try {
            const homeUrl = process.env.REACT_APP_HOME_URL || "http://localhost:3000";
            await axios({
                method: "POST",
                url: `${homeUrl}/api/exercises/add`,
                data: {
                    exercise,
                    muscleGroup,
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
                setExercisesPostAdd(res.data.exercises);
                setError(null);

                // CLear fields
                values.muscleGroup = "";
                values.exercise = "";
            });
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
        handleChange,
        handleKeyDown,
        values,
        handleSubmit,
        error,
        prevError,
        successMsg,
        prevSuccessMsg,
        exercisesPostAdd
    };
}
