const formatDateSlashes = (t) => {
    const date = new Date(t);

    let month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;

    let day = date.getDate();
    if (day < 10) day = "0" + day;

    const year = date.getFullYear();

    return month + "/" + day + "/" + year;
}

module.exports.formatDateSlashes = formatDateSlashes;

module.exports.formatDateHyphens = (t) => {
    const pieces = formatDateSlashes(t).split("/");
    return pieces[2] + "-" + pieces[0] + "-" + pieces[1];
}