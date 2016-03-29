import request from 'yfjs/lib/request';
import {formatDate} from '../date-format';

const ZhihuAPIBase = 'http://news-at.zhihu.com/api/4';
const getZhihu = apiSubpath => request(ZhihuAPIBase + apiSubpath);

export const ANCHOR_DATE_FORMAT = 'yyyyMMdd';

/**
{
    date: "20140523",
    stories: [
        {
            title: "中国古代家具发展到今天有两个高峰，一个两宋一个明末（多图）",
            ga_prefix: "052321",
            images: [
                "http://p1.zhimg.com/45/b9/45b9f057fc1957ed2c946814342c0f02.jpg"
            ],
            type: 0,
            id: 3930445
        },
        ...
    ],
    top_stories: [
        {
            title: "商场和很多人家里，竹制家具越来越多（多图）",
            image: "http://p2.zhimg.com/9a/15/9a1570bb9e5fa53ae9fb9269a56ee019.jpg",
            ga_prefix: "052315",
            type: 0,
            id: 3930883
        },
        ...
    ]
}
*/
export const getLatestArticles = () => getZhihu('/news/latest');


/*
{
    body: '<div class="main-wrap content-wrap">...</div>',
    image_source: "Yestone.com 版权图片库",
    title: "深夜惊奇 · 朋友圈错觉",
    image: "http://pic3.zhimg.com/2d41a1d1ebf37fb699795e78db76b5c2.jpg",
    share_url: "http://daily.zhihu.com/story/4772126",
    js: [ ],
    recommenders: [
        { "avatar": "http://pic2.zhimg.com/fcb7039c1_m.jpg" },
        { "avatar": "http://pic1.zhimg.com/29191527c_m.jpg" },
        { "avatar": "http://pic4.zhimg.com/e6637a38d22475432c76e6c9e46336fb_m.jpg" },
        { "avatar": "http://pic1.zhimg.com/bd751e76463e94aa10c7ed2529738314_m.jpg" },
        { "avatar": "http://pic1.zhimg.com/4766e0648_m.jpg" }
    ],
    ga_prefix: "050615",
    section: {
        "thumbnail": "http://pic4.zhimg.com/6a1ddebda9e8899811c4c169b92c35b3.jpg",
        "id": 1,
        "name": "深夜惊奇"
    },
    type: 0,
    id: 4772126,
    css: [
        "http://news.at.zhihu.com/css/news_qa.auto.css?v=1edab"
    ]
}
*/
export const getArticle = articleId => getZhihu(`/news/${articleId}`);


/*
{
    date: "20131118",
    stories: [
        {
            title: "深夜食堂 · 我的张曼妮",
            ga_prefix: "111822",
            images: [
                "http://p4.zhimg.com/7b/c8/7bc8ef5947b069513c51e4b9521b5c82.jpg"
            ],
            type: 0,
            id: 1747159
        },
        ...
    ]
}
*/
export const getDailyArticles = date => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    return getZhihu(`/news/before/${formatDate(nextDate, ANCHOR_DATE_FORMAT)}`);
};
