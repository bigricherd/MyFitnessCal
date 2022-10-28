// This function is used on the Exercises and MuscleGroups enums and formats their elements to make presentable to the user
//      - replaces underscores with whitespace
//      - capitalizes words, as well as the acronyms:
//      'DB' - dumbbell, 'BB' - barbell, 'UL' - unilateral
//      'OH' - overhead, 'UH' - underhand, 'BO' - bent-over

const formatExercise = (item, delimiter = '_') => {
    let newString = [];
    let tmp = item.split(delimiter);
    for (let i = 0; i < tmp.length; i++) {
        let lowered = tmp[i].toLowerCase();
        if (lowered === 'bb') tmp[i] = 'Barbell';
        else if (lowered === 'db') tmp[i] = 'Dumbbell';
        else if (lowered === 'ul') tmp[i] = 'Unilateral';
        else if (lowered === 'oh') tmp[i] = 'Overhead';
        else if (lowered === 'uh') tmp[i] = 'Underhand';
        else if (lowered === 'bo') tmp[i] = 'Bentover';
        else if (lowered === 'bw') tmp[i] = 'Bodyweight'
        else tmp[i] = tmp[i].charAt(0).toUpperCase() + tmp[i].slice(1);
    }
    newString.push(tmp.join(' '));
    return newString;
}

export default formatExercise;