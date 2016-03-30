import immutable from 'immutable';

import {createReducer} from 'yfjs/lib/redux-utils';
import * as actions from './actions';

const defaultState = immutable.Map({
    content: null,
    extra: null,
    comments: null
});

export default createReducer(new Map([
    [actions.getArticle, (state, article) => state.set('content', immutable.fromJS(article))],
    [actions.getArticleExtra, (state, articleExtra) => state.set('extra', immutable.fromJS(articleExtra))],
    [actions.getArticleComments, (state, comments) => state.set('comments', immutable.fromJS(comments))],
    [actions.clear, () => defaultState]
]), {
    defaultState
});
