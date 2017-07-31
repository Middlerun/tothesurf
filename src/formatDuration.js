import moment from 'moment'

export function formatDuration(duration, integer) {
  if (duration === null) {
    return '?'
  }
  const fractionFormat = integer ? '' : '.S'
  if (duration < moment.duration(1, 'hours')) {
    return `${moment(duration.asMilliseconds()).utc().format('m:ss' + fractionFormat)}`
  } else {
    return `${moment(duration.asMilliseconds()).utc().format('H:mm:ss' + fractionFormat)}`
  }
}
