import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native'

class TabBar extends Component {
  textStyle(tabName) {
    return (tabName === this.props.selected
      ? styles.tabTextSelected
      : styles.tabText)
  }

  tabStyle(tabName) {
    return (tabName === this.props.selected
      ? styles.tabSelected
      : styles.tab)
  }

  render() {
    return (
      <View style={styles.tabBar}>
        <TouchableOpacity style={this.tabStyle('progress')} onPress={() => this.props.onChange('progress')}>
          <Text style={this.textStyle('progress')}>Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity style={this.tabStyle('setup')} onPress={() => this.props.onChange('setup')}>
          <Text style={this.textStyle('setup')}>Setup</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  tabBar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
    flexDirection: 'row',
  },
  tab: {
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabSelected: {
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#00f',
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 17,
    color: '#0007',
  },
  tabTextSelected: {
    fontSize: 17,
    color: '#000',
  },
})

export default TabBar
