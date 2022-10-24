const { performQuery } = require('../utils/dbModule');

// Returns an array that represents the muscleGroup enum. Not in use as we store muscleGroups array on the Client side as well, since it is static.
const getMuscleGroups = async () => {
    const res = await performQuery('SELECT enum_range(NULL::musclegroup)');
    const enumString = res.rows[0].enum_range;
    const enumArray = enumString.substring(1, enumString.length - 1).split(',');
    return enumArray;
}


// Returns a map {exercise : muscleGroup} that represents the Exercise enum.
// Exercises are stored in the string format "exercise:muscleGroup" in the Exercise enum, hence the reformatting into a map.
const getExerciseMap = async () => {
    const res = await performQuery(`SELECT name, musclegroup FROM exercises ORDER BY musclegroup, name`);
    const map = new Map();
    for (let pair of res.rows) {
        map.set(pair.name, pair.musclegroup);
    }
    return map;
}

// Returns the Exercise enum as an array and without their corresponding muscleGroups.
const getExercisesArray = async () => {
    const res = await performQuery('SELECT nameandmusclegroup FROM exercises ORDER BY musclegroup, name');

    const arr = [];
    for (let item of res.rows) {
        arr.push(item.nameandmusclegroup);
    }
    //console.log(arr);

    return arr;
}

const test = async () => {
    const muscleGroups = await getMuscleGroups();
    const exerciseMap = await getExerciseMap();
    const getExercisesArray = await getExercisesArray();
    console.log(muscleGroups);
    console.log(exerciseMap);
    console.log(getExercisesArray);
}

//test();

module.exports.getMuscleGroups = getMuscleGroups;
module.exports.getExerciseMap = getExerciseMap;
module.exports.getExercisesArray = getExercisesArray;
