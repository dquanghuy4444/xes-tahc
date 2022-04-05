import moment from "moment"

export const getTimePeriodToPresent = (datetime) => {
    if (!datetime){
        return "1 phút"
    }

    const duration = moment.duration(moment().diff(moment(datetime)))
    let time = Math.ceil(duration.asMinutes())

    let str = `${time === 0 ? 1 : time} phút`

    if (time >= 60){
        time = Math.ceil(duration.asHours())
        str = `${time} giờ`
    }

    if (time >= 24){
        time = Math.ceil(duration.asDays())
        str = `${time} ngày`
    }

    return str
}
