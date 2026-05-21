function isFutureDate(date) {
    return date > new Date();
}

function hoursDifference(date1, date2) {
    return Math.abs(date1 - date2) / (1000 * 60 * 60);
}

module.exports = {
    isFutureDate,
    hoursDifference,
};