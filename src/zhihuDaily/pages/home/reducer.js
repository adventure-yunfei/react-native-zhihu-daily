import immutable from 'immutable';

import {createReducer} from 'yfjs/lib/redux-utils';
import * as actions from './actions';

export default createReducer(new Map([
    [actions.getLatestArticles, (state, data) => {
        return state
            .setIn(['articlesByDay', data.date], immutable.fromJS(data.stories))
            .set('lastLoadedDate', data.date)
            .set('topArticles', immutable.fromJS(data.top_stories));
    }],
    [actions.getDailyArticles, (state, data) => {
        return state
            .setIn(['articlesByDay', data.date], immutable.fromJS(data.stories))
            .set('lastLoadedDate', data.date);
    }]
]), {
    defaultState: immutable.Map()
});
