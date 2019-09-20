function formatDate(time) {
    var date = new Date(time);
    var getYear = date.getFullYear();
    var getMonth = date.getMonth() + 1;
    var getDate = date.getDate();
    getMonth = (getMonth < 10) ? "0" + getMonth : getMonth;
    getDate = (getDate < 10) ? "0" + getDate : getDate;
    return getYear + "-" + getMonth + "-" + getDate;
}