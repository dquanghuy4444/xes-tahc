import moment from "moment"


export const formatDatetime = (dt , fm = 'HH:mm:ss DD-MM-YYYY') => moment(dt).format(fm)
