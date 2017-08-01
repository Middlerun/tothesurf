import React, { Component } from 'react'
import { Text } from 'react-native'
import moment from 'moment'

import { formatDuration } from '../formatDuration'

class RunTime extends Component {
  constructor(props) {
    super(props)

    this.state = {
      updateInterval: null,
      runTimeDisplay: this.getRunTimeDisplay(props),
    }
  }

  startUpdating() {
    // console.log('starting updates')
    this.setState({
      updateInterval: setInterval(this.update.bind(this), 100),
    })
  }

  stopUpdating() {
    // console.log('stopping updates')
    clearInterval(this.state.updateInterval)
    this.setState({
      updateInterval: null,
    })
  }

  shouldDoUpdates(props) {
    return (props.startTime && !props.finishTime)
  }

  componentDidMount() {
    if (this.shouldDoUpdates(this.props)) {
      this.startUpdating()
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps.startTime)
    this.update()
    if (!this.shouldDoUpdates(this.props) && this.shouldDoUpdates(nextProps)) {
      this.startUpdating()
    }
    else if (this.shouldDoUpdates(this.props) && !this.shouldDoUpdates(nextProps)) {
      this.stopUpdating()
    }
    this.update(nextProps)
  }

  componentWillUnmount() {
    if (this.state.updateInterval) {
      this.stopUpdating()
    }
  }

  formatTime(start, finish) {
    const time = moment.duration(finish - start)
    return formatDuration(time)
  }

  getRunTimeDisplay(props) {
    props = props || this.props
    if (!props.startTime) {
      return '-'
    } else if (props.finishTime) {
      return this.formatTime(props.startTime, props.finishTime)
    } else {
      return this.formatTime(props.startTime, moment())
    }
  }

  update(props) {
    this.setState({ runTimeDisplay: this.getRunTimeDisplay(props) })
  }

  render() {
    return (
      <Text style={this.props.style}>{this.state.runTimeDisplay}</Text>
    )
  }
}

export default RunTime
