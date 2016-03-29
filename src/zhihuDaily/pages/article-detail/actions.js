import {createAction, setActionToString} from 'yfjs/lib/redux-utils';
import * as zhihuAPI from '../../zhihuAPI';

export const getArticle = articleId => createAction(
    getArticle,
    zhihuAPI.getArticle(articleId)
);

export const clear = () => createAction(clear);

setActionToString('home', {
    getArticle,
    clear
});
