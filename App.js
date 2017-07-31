import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { Permissions } from 'expo'

import Main from './src/components/Main'

export default class App extends Component {
  constructor() {
    super()

    this.state = {
      permsGranted: false,
      permsDenied: false,
    }

    this.getPermission()
  }

  getPermission() {
    Permissions.askAsync(Permissions.LOCATION)
      .then((result) => {
        if (result.status === 'granted') {
          this.setState({
            permsGranted: true,
          })
        }
      })
  }

  render() {
    if (this.state.permsDenied) {
      return <View style={styles.container}>
        <TouchableOpacity onPress={this.getPermission.bind(this)}>
          <Text>You need to grant location permission for this app to work. Tap here to grant permission.</Text>
        </TouchableOpacity>
      </View>
    }

    if (this.state.permsGranted) {
      return <Main/>
    }

    return null
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
})
