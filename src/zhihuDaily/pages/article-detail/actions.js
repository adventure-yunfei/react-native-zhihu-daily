import {createAction, setActionToString} from 'yfjs/lib/redux-utils';
import * as zhihuAPI from '../../zhihuAPI';

export const getArticle = articleId => createAction(
    getArticle,
    zhihuAPI.getArticle(articleId)
);

export const getArticleExtra = articleId => createAction(
    getArticleExtra,
    zhihuAPI.getArticleExtra(articleId)
);

export const getArticleComments = articleId => createAction(
    getArticleComments,
    Promise.all([
        zhihuAPI.getArticleLongComments(articleId),
        zhihuAPI.getArticleShortComments(articleId)
    ]).then(([longComments, shortComments]) => {
        return longComments.comments.concat(shortComments.comments).sort((a, b) => b.time - a.time);
    })
);

export const clear = () => createAction(clear);

setActionToString('home', {
    getArticle,
    getArticleExtra,
    getArticleComments,
    clear
});
