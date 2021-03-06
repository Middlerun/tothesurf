import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'
import moment from 'moment'
import DateTimePicker from 'react-native-modal-datetime-picker'

import RunTime from './RunTime'
import DurationPicker from './DurationPicker'
import { formatDuration } from '../formatDuration'

class Setup extends Component {
  constructor() {
    super()
    
    this.state = {
      showTimePicker: false,
      showDurationPicker: false,
      onUpdateTime: null,
    }
  }
  
  openTimePicker(onUpdateTime) {
    this.setState({
      showTimePicker: true,
      onUpdateTime,
    })
  }

  confirmTimePicker(selectedTime) {
    this.state.onUpdateTime(moment(selectedTime))
    this.setState({
      showTimePicker: false,
    })
  }

  cancelTimePicker() {
    this.setState({
      showTimePicker: false,
    })
  }

  openDurationPicker() {
    this.setState({
      showDurationPicker: true,
    })
  }

  cancelDurationPicker() {
    this.setState({
      showDurationPicker: false,
    })
  }

  confirmDurationPicker(duration) {
    this.setState({
      showDurationPicker: false,
    })
    this.props.onChangeGoalTime(duration)
  }

  formatTime(time) {
    return time ? time.format('h:mm a') : '-'
  }

  render() {
    return (
      <View style={styles.timer}>
        <View style={styles.row}>
          <Text style={styles.rowText}>Start time: {this.formatTime(this.props.startTime)}</Text>

          <TouchableOpacity style={styles.rowButton} onPress={() => this.openTimePicker(this.props.onChangeStartTime)}>
            <Text>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowButton} onPress={() => this.props.onChangeStartTime(null)}>
            <Text>Clear</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowText}>Finish time: {this.formatTime(this.props.finishTime)}</Text>

          <TouchableOpacity style={styles.rowButton} onPress={() => this.openTimePicker(this.props.onChangeFinishTime)}>
            <Text>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowButton} onPress={() => this.props.onChangeFinishTime(null)}>
            <Text>Clear</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowText}>Current run time: </Text>
          <RunTime style={styles.rowText} startTime={this.props.startTime} finishTime={this.props.finishTime}/>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowText}>Goal time: {formatDuration(this.props.goalTime)}</Text>
          <TouchableOpacity style={styles.rowButton} onPress={this.openDurationPicker.bind(this)}>
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.startButton} onPress={() => this.props.onChangeStartTime(moment())}>
            <Text>Start</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.finishButton} onPress={() => this.props.onChangeFinishTime(moment())}>
            <Text>Finish!</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.locationTestButton} onPress={this.props.toggleLocationTest}>
            <Text>{this.props.locationTest ? 'Test' : 'GPS'}</Text>
          </TouchableOpacity>
        </View>

        <DateTimePicker
          isVisible={this.state.showTimePicker}
          onConfirm={this.confirmTimePicker.bind(this)}
          onCancel={this.cancelTimePicker.bind(this)}
          mode="time"
          is24Hour={false}
        />

        <DurationPicker
          duration={this.props.goalTime}
          isVisible={this.state.showDurationPicker}
          onCancel={this.cancelDurationPicker.bind(this)}
          onConfirm={this.confirmDurationPicker.bind(this)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  timer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rowText: {
    padding: 5,
    fontSize: 20,
    flex: 1,
  },
  rowButton: {
    marginLeft: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fafafa',
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtons: {
    flexDirection: 'row',
    padding: 5,
  },
  startButton: {
    flex: 4,
    margin: 5,
    borderWidth: 1,
    borderColor: '#070',
    backgroundColor: '#0c0',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishButton: {
    flex: 4,
    margin: 5,
    borderWidth: 1,
    borderColor: '#700',
    backgroundColor: '#c00',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationTestButton: {
    flex: 1,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fafafa',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Setup
