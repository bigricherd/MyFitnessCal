import { useState } from 'react';
import { isAfter, isEqual } from 'date-fns';
import axios from 'axios';

// ------ This hook is identical to useForm, except it submits the forms in Register and Login components so its values are {username, password} ------
export default function useForm({ initialValues }) {
    const [values, setValues] = useState(initialValues || {});
    const [error, setError] = useState(null);
    const [prevError, setPrevError] = useState(null);
    const [numSessions, setNumSessions] = useState(null);

    //track form values
    const handleChange = event => {
        const value = event.target.value;
        const name = event.target.name;
        setValues({
            ...values,
            [name]: value
        });
    };

    //submit form when enter key is pressed
    const handleKeyDown = event => {
        const enter = 13;
        if (event.keyCode === enter) {
            return handleSubmit(event);
        }
    };

    const validateInputs = (values) => {
        if (!prevError || (error !== prevError)) {
            setPrevError(error);
        } else {
            setPrevError(null);
        }
        const { title, date, startdatetime, enddatetime, comments, sets } = values;
        if (!title || !date || !startdatetime || !enddatetime) {
            setError("Please fill out required fields.");
            return false;
        } else if (title.length > 35) {
            setError("Maximum title length is 35 characters.");
            return false;
        } else if (comments.length > 40) {
            setError("Maximum comments length is 40 characters.");
        } else if (startdatetime && enddatetime) {

            // End time <= start time
            startdatetime.setDate(date.getDate());
            enddatetime.setDate(date.getDate());
            if (isAfter(startdatetime, enddatetime) || isEqual(startdatetime, enddatetime)) {
                setError("End time must come after start time.");
                return false;
            }
            // Sets validation
            if (sets && sets.length > 0) {
                return validateSets(sets);
            }
        }
        return true;
    };

    const validateSets = (sets) => {
        for (let set of sets) {
            let { exercise } = set;
            let muscleGroup = exercise.split(":")[1];
            
            console.log(muscleGroup);
            console.log(set);
                        
            if (muscleGroup !== "cardio" && (parseInt(set.reps) <= 0 || set.reps === "")) {
                setError("Minimum reps for a set is 1.");
                return false;
            } else if (muscleGroup !== "cardio" && (parseInt(set.weight) < 0 || set.weight === "")) {
                setError("Weight cannot be negative.");
                return false;
            } else if (muscleGroup === "cardio" && (parseInt(set.distance <= 0) || set.distance === "")) {
                setError("Distance must be greater than 0.");
                return false;
            } else if (muscleGroup === "cardio" && (parseInt(set.duration <= 0) || set.duration === "")) {
                setError("Duration must be greater than 0 minutes.");
                return false;
            }
        };
        return true;
    };

    //submit form when submit button is clicked
    const handleSubmit = event => {
        event.preventDefault();
        if (validateInputs(values)) {
            return submitData({ values });
        }
        return false;
    };

    //send data to database
    const submitData = async (formValues) => {
        const dataObject = formValues.values;
        let { title, comments, date, startdatetime, enddatetime, sets, units } = dataObject;

        try {
            // Sets start and end times to be on the selected date; necessary because it defaults to today.
            startdatetime.setDate(date.getDate());
            enddatetime.setDate(date.getDate());
            
            startdatetime.setMonth(date.getMonth());
            enddatetime.setMonth(date.getMonth());

            startdatetime.setFullYear(date.getFullYear());
            enddatetime.setFullYear(date.getFullYear());

            if (units === "kg") {
                for (let set of sets) {
                    set["weight"] = (parseInt(set.weight) * 2.20462262).toString();
                }
            }

            const homeUrl = process.env.REACT_APP_HOME_URL || "http://localhost:3000";
            await axios({
                method: 'POST',
                url: `/api/sessions/add`,
                data: {
                    title,
                    comments,
                    date,
                    startdatetime,
                    enddatetime,
                    sets
                },
                headers: new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' }),
                withCredentials: true

            }).then(res => {
                setError(null);
                setNumSessions(res.data.count);
                return true;
            })
        } catch (err) {
            if (!prevError || (error !== prevError)) {
                setPrevError(error);
            } else {
                setPrevError(null);
            }
            // Extra line of defense in case empty date / times somehow get past validateInputs() above
            if (err.message && err.message === "date.getDate is not a function") {
                setError("Please enter a date, start time, and end time.");
            } else {
                setError(err.response.data.message);
            }
            return false;
        }
    };
    return {
        handleChange,
        handleKeyDown,
        values,
        setValues,
        handleSubmit,
        error,
        setError,
        prevError,
        numSessions
    }
}