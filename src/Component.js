import React from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';

export default class Component extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
}
