import { AsyncStorage } from 'react-native'
import moment from 'moment'

const startTimeKey = '@ToTheSurf:startTime'
const finishTimeKey = '@ToTheSurf:finishTime'
const goalTimeKey = '@ToTheSurf:goalTime'

export function setStartTime(startTime, callback) {
  if (startTime) {
    AsyncStorage.setItem(startTimeKey, startTime.format(), callback)
  } else {
    AsyncStorage.removeItem(startTimeKey, callback)
  }
}

export function getStartTime() {
  return AsyncStorage.getItem(startTimeKey)
    .then((startTime) => {
      return startTime ? moment(startTime) : null
    })

}

export function setFinishTime(finishTime, callback) {
  if (finishTime) {
    AsyncStorage.setItem(finishTimeKey, finishTime.format(), callback)
  } else {
    AsyncStorage.removeItem(finishTimeKey, callback)
  }
}

export function getFinishTime() {
  return AsyncStorage.getItem(finishTimeKey)
    .then((finishTime) => {
      return finishTime ? moment(finishTime) : null
    })
}

export function setGoalTime(goalTime, callback) {
  AsyncStorage.setItem(goalTimeKey, `${goalTime.asMilliseconds()}`, callback)
}

export function getGoalTime() {
  return AsyncStorage.getItem(goalTimeKey)
    .then((goalTime) => {
      return goalTime ? moment.duration(parseInt(goalTime)) : moment.duration(2, 'hours')
    })
}

export function getStartAndFinishTimes() {
  return AsyncStorage.multiGet([startTimeKey, finishTimeKey, goalTimeKey])
    .then((results) => {
      // console.log(results)
      return {
        startTime: results[0][1] ? moment(results[0][1]) : null,
        finishTime: results[1][1] ? moment(results[1][1]) : null,
        goalTime: results[2][1] ? moment.duration(parseInt(results[2][1])) : moment.duration(2, 'hours')
      }
    })
}
