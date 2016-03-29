import React, {
    Component,
    StyleSheet,
    Navigator
} from 'react-native';
import {Provider} from 'react-redux';

import Home from './home/Home';
import store from '../store';

const INITIAL_ROUTE = {
    component: Home,
    props: {}
};
export default class MainNavigator extends Component {
    onTabIndexChange = tabIndex => {
        this.refs['navigator'].jumpTo(INITIAL_ROUTE[tabIndex]);
    };

    getTabIndexByRoute = route => INITIAL_ROUTE.indexOf(route);

    renderScene(route, navigator) {
        return <route.component navigator={navigator} {...route.props}/>;
    }

    configureScene = (route, routeStack) => {
        if (route.component.configureScene) {
            return route.component.configureScene(route, routeStack);
        } else {
            return {...Navigator.SceneConfigs.HorizontalSwipeJump};
        }
    };

    render() {
        return (
            <Provider store={store}>
                <Navigator style={styles.appContainer}
                           initialRoute={INITIAL_ROUTE}
                           renderScene={this.renderScene}
                           configureScene={this.configureScene}
                />
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        overflow: 'hidden',
        backgroundColor: '#dddddd'
    }
});
