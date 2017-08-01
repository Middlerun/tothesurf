import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Picker,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native'
import moment from 'moment'

class DurationPicker extends Component {
  constructor(props) {
    super(props)

    const duration = props.duration || moment.duration(0)
    this.state = {
      hour: duration.hours(),
      minute: duration.minutes(),
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isVisible && nextProps.isVisible) {
      const duration = nextProps.duration || moment.duration(0)
      this.setState({
        hour: duration.hours(),
        minute: duration.minutes(),
      })
    }
  }

  timeValid() {
    return (this.state.hour > 0 || this.state.minute > 0)
  }

  onConfirm() {
    if (!this.timeValid()) {
      return
    }

    const duration = moment.duration(this.state.hour * 60 + this.state.minute, 'minutes')
    this.props.onConfirm(duration)
  }

  render() {
    let hours = [], minutes = []
    for (let i=0; i<24; i++) { hours.push(i) }
    for (let i=0; i<60; i++) { minutes.push(i) }

    return (
      <Modal visible={this.props.isVisible} onRequestClose={this.props.onCancel} transparent={true}>
        <View style={styles.modalOuter}>
          <TouchableWithoutFeedback onPress={this.props.onCancel}>
            <View style={styles.overlay}/>
          </TouchableWithoutFeedback>

          <View style={styles.modalInner}>
            <View style={styles.row}>
              <Text style={styles.label}>Hours</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={this.state.hour}
                  onValueChange={hour => this.setState({ hour })}
                >
                  {hours.map(hour => <Picker.Item label={`${hour}`} value={hour} key={hour}/>)}
                </Picker>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Minutes</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={this.state.minute}
                  onValueChange={minute => this.setState({ minute })}
                >
                  {minutes.map(minute => <Picker.Item label={`${minute}`} value={minute} key={minute}/>)}
                </Picker>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={this.props.onCancel}>
                <Text style={styles.button}>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={this.onConfirm.bind(this)}>
                <Text style={styles.button}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modalOuter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    opacity: 0.5,
  },
  modalInner: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: 20,
  },
  picker: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#476fa0',
    padding: 10,
  }
})

export default DurationPicker
