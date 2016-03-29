import immutable from 'immutable';

import {createReducer} from 'yfjs/lib/redux-utils';
import * as actions from './actions';

export default createReducer(new Map([
    [actions.getArticle, (state, article) => immutable.fromJS(article)],
    [actions.clear, () => null]
]));
