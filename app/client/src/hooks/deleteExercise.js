import axios from 'axios';
import formatEnum from '../helpers/formatEnum';

// ------ This hook submits the forms in the MuscleGroupFilter component with a GET reqyest; its values are {fromDate, toDate} ------
// form values are passed in the query string as they do not contain sensitive information, simply user selections of the filters
export default async function handleDeleteExercise(exercise, slug) {

    exercise = exercise.toLowerCase();
    exercise = exercise.toString();
    console.log(typeof (exercise));
    exercise = exercise.split(' ').join('_');


    const baseUrl = process.env.REACT_APP_HOME_URL || 'http://localhost:5000';
    const url = `${baseUrl}/api/exercises/?name=${exercise}`; // Sending a delete request using method override
    console.log(url);

    const res = await axios({
        method: 'DELETE',
        url,
        headers: new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' }),
        withCredentials: true
    });
    console.log(res.data);
    let arr = [];
    for (let row of res.data) {
        arr.push(row.name);
    }
    console.log(arr);
    arr = formatEnum(arr);
    return arr;
}