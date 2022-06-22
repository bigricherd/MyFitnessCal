// This function is used on the Exercises and MuscleGroups enums and formats their elements to make presentable to the user
//      - replaces underscores with whitespace
//      - capitalizes words, as well as the acronyms 'DB' and 'BB'

const formatEnum = (arr) => {
    let newList = [];

    // Sorry for using a nested loop
    for (let item of arr) {
        let tmp = item.split('_');
        for (let i = 0; i < tmp.length; i++) {
            if (tmp[i] === 'bb') tmp[i] = 'BB';
            else if (tmp[i] === 'db') tmp[i] = 'DB';
            else tmp[i] = tmp[i].charAt(0).toUpperCase() + tmp[i].slice(1);
        }
        newList.push(tmp.join(' '));
    }
    return newList;
}

export default formatEnum;