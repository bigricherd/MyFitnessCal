import { useState } from "react";
import axios from "axios";

export default function useForm({ initialValues, muscleGroups = [], setExercises, setCount }) {
    const [values, setValues] = useState(initialValues || {});
    const [error, setError] = useState(null);
    const [prevError, setPrevError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [prevSuccessMsg, setPrevSuccessMsg] = useState(null);
    const [firstVisit, setFirstVisit] = useState(true);

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

        return validateExercises(exercises);
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
        const { exercises } = dataObject;
        try {
            const homeUrl = process.env.REACT_APP_HOME_URL || "http://localhost:3000";
            await axios({
                method: "POST",
                url: `${homeUrl}/api/exercises/addMany`,
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
        submitData,
        error,
        prevError,
        successMsg,
        prevSuccessMsg,
        firstVisit
    };
}
