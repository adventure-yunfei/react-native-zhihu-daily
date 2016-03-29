import {combineImmutableReducers, pendingActionsReducer} from 'yfjs/lib/redux-utils';
import home from './pages/home/reducer';
import article from './pages/article-detail/reducer';

export default combineImmutableReducers({
    pendingActions: pendingActionsReducer,

    home,
    article
});
