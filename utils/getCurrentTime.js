import moment from "moment";

const getCurrentTime = () => moment(Date.now()).format("YYYY/MM/DD HH:mm:ss");

export default getCurrentTime;
