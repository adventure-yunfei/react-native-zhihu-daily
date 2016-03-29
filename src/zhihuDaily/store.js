import {createStore, compose, applyMiddleware} from 'redux';
import immutable from 'immutable';
import createLogger from 'redux-logger';

import {promisePayloadMiddleware, ensureActionToStringMiddleware} from 'yfjs/lib/redux-utils';
import mainReducer from './reducers';

const logger = createLogger({
    stateTransformer: state => state.toJS(),
    actionTransformer: action => ({
        ...action,
        payload: action.payload && action.payload.toJS ? action.payload.toJS() : action.payload
    }),
    collapsed: true
});

const enhancer = compose(
    applyMiddleware(
        promisePayloadMiddleware,
        ...(__DEV__ ? [ensureActionToStringMiddleware, logger] : [])
    )
);

export default createStore(mainReducer, immutable.Map(), enhancer);
