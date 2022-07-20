import { useState } from "react";
import axios from "axios";

// ------ Custom form control: submits AddSet and AddExercise forms and redirects to home if successful or login if unsuccessful ------
export default function useForm({ initialValues, slug }) {
    const [values, setValues] = useState(initialValues || {});
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
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

    //submit form when submit button is clicked
    const handleSubmit = (event) => {
        event.preventDefault();
        if (values.date != null) {
            values.date = values.date.toISOString();
        }
        submitData({ values });
    };

    const baseUrl = process.env.REACT_APP_HOME_URL || "http://localhost:5000";

    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        const { reps, weight, date, exercise, muscleGroup } = dataObject;
        try {
            await axios({
                method: "POST",
                url: `${baseUrl}/${slug}`,
                data: {
                    reps,
                    weight,
                    date,
                    exercise,
                    muscleGroup,
                },
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                }),
                withCredentials: true,
            }).then((res) => {
                console.log(res.data);
                if (res.data.redirect === "/") {
                    window.location = "/";
                } else if (res.data.redirect === "/login") {
                    window.location = "/login";
                } else if (res.data.redirect === "/forms") {
                    window.location = "/forms";
                }
                setSuccessMsg(res.data.message);
                setExercisesPostAdd(res.data.exercises);
                setError(null);
            });
        } catch (err) {
            console.log(err);
            setError(err.response.data.message);
        }
    };
    return {
        handleChange,
        handleKeyDown,
        values,
        handleSubmit,
        error,
        successMsg,
        exercisesPostAdd,
    };
}
