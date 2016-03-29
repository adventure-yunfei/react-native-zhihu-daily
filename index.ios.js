import React, {AppRegistry, Component} from 'react-native';

import MainNavigator from './src/zhihuDaily/pages/MainNavigator';

global.__DEV__ = true; // TODO: make __DEV__ configurable

//class reactnative extends Component {
//    render() {
//        return (
//            <View style={styles.container}>
//                <Text style={styles.welcome}>
//                    Welcome to React Native!
//                </Text>
//                <Text style={styles.instructions}>
//                    To get started, edit index.ios.js
//                </Text>
//                <Text style={styles.instructions}>
//                    Press Cmd+R to reload,{'\n'}
//                    Cmd+D or shake for dev menu
//                </Text>
//            </View>
//        );
//    }
//}

class reactnative extends Component {
    render() {
        return <MainNavigator/>;
    }
}

AppRegistry.registerComponent('reactnative', () => reactnative);
