const formatTime = (t) => {
    const date = new Date(t);
    let ap = 'AM';
    let hours = date.getHours();

    if (hours >= 12) ap = 'PM';
    if (hours !== 12) {
        hours = (hours % 12).toString();
    }
    let minutes = date.getMinutes().toString();
    if (minutes < 10) minutes = "0" + minutes;

    return hours + ":" + minutes + " " + ap;

}

export default formatTime;