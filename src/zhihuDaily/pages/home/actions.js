import {createAction, setActionToString} from 'yfjs/lib/redux-utils';
import * as zhihuAPI from '../../zhihuAPI';

export const getLatestArticles = () => createAction(
    getLatestArticles,
    zhihuAPI.getLatestArticles()
);

export const getDailyArticles = date => createAction(
    getDailyArticles,
    zhihuAPI.getDailyArticles(date)
);

setActionToString('home', {
    getLatestArticles,
    getDailyArticles
});
