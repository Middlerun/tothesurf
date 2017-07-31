import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { MapView, Location } from 'expo'
import moment from 'moment'

import TabBar from './TabBar'
import Setup from './Setup'
import RunTime from './RunTime'
import route, { routeDistance } from '../route'
import { distanceAlongRoute, formatKms } from '../routeMath'
import { getStartAndFinishTimes, setStartTime, setFinishTime, setGoalTime } from '../storage'
import { formatDuration } from '../formatDuration'

class Main extends Component {
  constructor() {
    super()
    this.state = {
      currentLocation: route[0],
      distanceRun: 0,
      selectedTab: 'progress',
      timesFetched: false,
      startTime: null,
      finishTime: null,
      runTime: 0,
      updateInterval: null,
      goalTime: moment.duration(2, 'hours'),
      avgPace: null,
      measuredSpeed: 0,
      timeEstimate: null,
      locationTest: false,
      locationWatcher: this.setupLocationWatcher(),
    }
  }

  setupLocationWatcher() {
    const self = this
    Location.watchPositionAsync({
      enableHighAccuracy: true,
      timeInterval: 3000,
    }, (locationData) => {
      // console.log(locationData)
      self.setState({
        currentLocation: {
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
        },
        measuredSpeed: locationData.coords.speed,
      })
    }).then((locationWatcher) => {
      self.setState({
        locationWatcher,
      })
    })
  }

  componentWillMount() {
    getStartAndFinishTimes().then((results) => {
      this.setState(results)
    })
  }

  componentDidMount() {
    this.setState({
      updateInterval: setInterval(this.update.bind(this), 1000)
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.updateInterval)
    if (this.state.locationWatcher) {
      this.state.locationWatcher.remove()
    }
  }

  update() {
    let runTime

    if (!this.state.startTime) {
      runTime = moment.duration(0)
    } else if (this.state.finishTime) {
      runTime = moment.duration(this.state.finishTime - this.state.startTime)
    } else {
      runTime = moment.duration(moment() - this.state.startTime)
    }

    const distanceRun = distanceAlongRoute(this.state.currentLocation)

    const avgPace = (distanceRun > 0
      ? moment.duration(runTime.asMilliseconds() / (distanceRun / 1000)) // ms/km
      : null)

    const timeEstimate = avgPace
      ? moment.duration(avgPace * (routeDistance / 1000))
      : null

    this.setState({
      runTime,
      distanceRun,
      avgPace,
      timeEstimate,
    })
  }

  formatKms(metres) {
    return (metres / 1000).toFixed(2)
  }

  formatPercentage(progress, total) {
    return (progress / total * 100).toFixed(1) + '%'
  }

  mpsToPace(speed) {
    if (speed === 0) {
      return null
    }
    return moment.duration((1 / speed) * 1000 * 1000)
  }

  handleTabChange(selectedTab) {
    // console.log(this.state)
    this.setState({
      selectedTab,
    })
  }

  setStartTime(startTime) {
    setStartTime(startTime)
    this.setState({ startTime })
  }

  setFinishTime(finishTime) {
    setFinishTime(finishTime)
    this.setState({ finishTime })
  }

  setGoalTime(goalTime) {
    setGoalTime(goalTime)
    this.setState({ goalTime })
  }

  toggleLocationTest() {
    this.setState(prevState => {
      if (prevState.locationTest) {
        this.setupLocationWatcher()
        return {
          locationTest: false,
        }
      } else {
        prevState.locationWatcher.remove()
        return {
          locationTest: true,
          locationWatcher: null,
        }
      }
    })
  }

  render() {
    return (
      <View style={styles.main}>
        <View style={styles.mapOuter}>
          <MapView
            style={styles.mapInner}
            initialRegion={{
              latitude: -33.8741175,
              longitude: 151.2488712,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <MapView.Polyline
              coordinates={route}
              strokeWidth={2}
              strokeColor="#00f"/>
            <MapView.Marker
              draggable={this.state.locationTest}
              coordinate={this.state.currentLocation}
              onDragEnd={(e) => this.setState({ currentLocation: e.nativeEvent.coordinate })}/>
          </MapView>
        </View>
        {this.state.selectedTab === 'progress' &&
          <View style={styles.tabContent}>
            <Text style={styles.statsLabel}>Progress:</Text>
            <View style={styles.statsValueRow}>
              <Text style={styles.statsValueLeft}>{this.formatKms(this.state.distanceRun)} km</Text>
              <Text style={styles.statsValueRight}>{this.formatPercentage(this.state.distanceRun, routeDistance)}</Text>
            </View>

            <Text style={styles.statsLabel}>Time:</Text>
            <View style={styles.statsValueRow}>
              <RunTime style={styles.statsValueLeft} startTime={this.state.startTime} finishTime={this.state.finishTime}/>
              <Text style={styles.statsValueRight}>{this.formatPercentage(this.state.runTime, this.state.goalTime)}</Text>
            </View>

            <Text style={styles.statsLabel}>Pace (average / current):</Text>
            <View style={styles.statsValueRow}>
              <Text style={styles.statsValueLeft}>{this.state.avgPace ? formatDuration(this.state.avgPace, true) : '?'}/km</Text>
              <Text style={styles.statsValueRight}>{formatDuration(this.mpsToPace(this.state.measuredSpeed), true)}/km</Text>
            </View>

            <Text style={styles.statsLabel}>Estimated finish time:</Text>
            <View style={styles.statsValueRow}>
              <Text style={styles.statsValueCenter}>{this.state.timeEstimate ? formatDuration(this.state.timeEstimate, true) : '?'}</Text>
            </View>
          </View>
        }
        {this.state.selectedTab === 'setup' &&
          <View style={styles.tabContent}>
            <Setup
              startTime={this.state.startTime}
              endTime={this.state.endTime}
              finishTime={this.state.finishTime}
              goalTime={this.state.goalTime}
              onChangeStartTime={this.setStartTime.bind(this)}
              onChangeFinishTime={this.setFinishTime.bind(this)}
              onChangeGoalTime={this.setGoalTime.bind(this)}
              locationTest={this.state.locationTest}
              toggleLocationTest={this.toggleLocationTest.bind(this)}
            />
          </View>
        }
        <View style={styles.tabArea}>
          <TabBar selected={this.state.selectedTab} onChange={this.handleTabChange.bind(this)}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mapOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 350,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mapInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 50,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsLabel: {
    fontSize: 15,
  },
  statsValueRow: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
  },
  statsValueLeft: {
    flex: 1,
    fontSize: 32,
    textAlign: 'left',
  },
  statsValueCenter: {
    flex: 1,
    fontSize: 32,
    textAlign: 'center',
  },
  statsValueRight: {
    flex: 1,
    fontSize: 32,
    textAlign: 'right',
  },
  tabArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
  },
  main: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
})

export default Main
