import React, {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    Image,
    Navigator,
    TouchableOpacity
} from 'react-native';
import {PropTypes} from 'react';
import immutable from 'immutable';
import {connect} from 'react-redux';
import {getTheme} from 'react-native-material-kit/lib/theme';
import {formatDate, parseDate} from '../../../date-format';
import Color from 'color';

import Component from '../../../Component';
import TopArticlesGallery, {GalleryHeight} from './TopArticlesGallery';
import ArticleDetail from './../article-detail/ArticleDetail';
import * as windowSize from '../../../lib/windowSize';
import * as colors from '../../../colors';
import {STATUS_BAR_HEIGHT} from '../../../variables';
import * as commonStyles from '../../commonStyles';
import * as actions from './actions';
import * as zhihuAPI from '../../zhihuAPI';

const NavBarHeight = STATUS_BAR_HEIGHT;

class Home extends Component {
    static propTypes = {
        articlesByDay: PropTypes.instanceOf(immutable.Map),
        topArticles: PropTypes.instanceOf(immutable.List),
        lastLoadedDate: PropTypes.string,
        pendingActions: PropTypes.instanceOf(immutable.Map).isRequired,
        navigator: PropTypes.instanceOf(Navigator).isRequired,
        dispatch: PropTypes.func.isRequired
    };

    static configureScene = (route, routeStack) => {
        return null;
    };

    constructor() {
        super(...arguments);
        const dataSource = new ListView.DataSource({
            getSectionHeaderData: (dataBlob, sectionKey) => sectionKey,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            dataSource: dataSource.cloneWithRowsAndSections({}, [], []),
            navBarBGOpacity: 0,
            listViewTop: 0
        };
    }

    jumpToArticle = articleId => {
        this.props.navigator.push({
            component: ArticleDetail,
            props: {
                articleId
            }
        });
    };

    refreshArticles = () => this.props.dispatch(actions.getLatestArticles());

    prepareArticleListDataSource(articlesByDay, lastLoadedDateStr) {
        const lastLoadedDate = parseDate(lastLoadedDateStr, zhihuAPI.ANCHOR_DATE_FORMAT);
        const dataBlob = {};
        const sectionKeys = [];
        for (const date = new Date(Date.now()); date > lastLoadedDate; date.setDate(date.getDate() - 1)) {
            const dateAnchor = formatDate(date, zhihuAPI.ANCHOR_DATE_FORMAT);
            dataBlob[dateAnchor] = Array.from(articlesByDay.get(dateAnchor) || []);
            sectionKeys.push(dateAnchor);
        }

        this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionKeys)
        });
    }

    loadMoreArticles = () => {
        const {lastLoadedDate, dispatch} = this.props;
        if (lastLoadedDate) {
            const previousDate = parseDate(lastLoadedDate, zhihuAPI.ANCHOR_DATE_FORMAT);
            previousDate.setDate(previousDate.getDate() - 1);
            dispatch(actions.getDailyArticles(previousDate));
        }
    };

    onScroll = (e) => {
        const scrollY = e.nativeEvent.contentOffset.y,
            scrollPercent = Math.min(scrollY / GalleryHeight, 1);
        this.setState({
            navBarBGOpacity: scrollPercent,
            listViewTop: scrollPercent * NavBarHeight
        });
    };

    componentWillMount() {
        this.refreshArticles();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.articlesByDay !== this.props.articlesByDay) {
            this.prepareArticleListDataSource(nextProps.articlesByDay, nextProps.lastLoadedDate);
        }
    }

    render() {
        const {topArticles, pendingActions} = this.props,
            {dataSource, navBarBGOpacity, listViewTop} = this.state,
            refreshing = !!pendingActions.get(actions.getLatestArticles.toString()),
            renderArticleRow = article => {
                const id = article.get('id'),
                    images = article.get('images');
                return (
                    <TouchableOpacity key={id}
                                      style={styles.newsWrapper}
                                      activeOpacity={0.8}
                                      onPress={() => this.jumpToArticle(id)}>
                        <View style={styles.news}>
                            <Image style={styles.newsImg} source={{uri: images && images.get(0) || 'TODO_DEFAULT'}}/>
                            <Text style={styles.newsText}>{article.get('title')}</Text>
                        </View>
                    </TouchableOpacity>
                );
            };

        return (
            <View style={commonStyles.flex_1}>
                <ListView style={[styles.listStyle, {top: listViewTop}]}
                          dataSource={dataSource}
                          renderHeader={() => topArticles && <TopArticlesGallery topArticles={topArticles} jumpToArticle={this.jumpToArticle}/>}
                          renderSectionHeader={dateAnchor => <Text style={styles.sectionHeader}>{formatDate(parseDate(dateAnchor, zhihuAPI.ANCHOR_DATE_FORMAT), 'M月d日')}</Text>}
                          renderRow={renderArticleRow}
                          onScroll={this.onScroll}
                          onEndReached={this.loadMoreArticles}
                          refreshControl={<RefreshControl onRefresh={this.refreshArticles} refreshing={refreshing}/>}/>
                <View style={[styles.navBar, {backgroundColor: Color(colors.Blue).alpha(navBarBGOpacity).rgbaString()}]}/>
            </View>
        );
    }
}

export default connect(state => ({
    articlesByDay: state.getIn(['home', 'articlesByDay']),
    topArticles: state.getIn(['home', 'topArticles']),
    lastLoadedDate: state.getIn(['home', 'lastLoadedDate']),
    pendingActions: state.get('pendingActions')
}))(Home);

const theme = getTheme();
const styles = StyleSheet.create({
    navBar: {
        position: 'absolute',
        top: 0,
        width: windowSize.width,
        height: NavBarHeight,
        paddingTop: STATUS_BAR_HEIGHT,
        backgroundColor: colors.Blue
    },

    listStyle: {
        flex: 1,
        backgroundColor: colors.White
    },

    sectionHeader: {
        color: colors.White,
        backgroundColor: colors.Blue,
        textAlign: 'center'
    },

    newsWrapper: {
        ...theme.cardStyle,
        flex: 0,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20
    },
    news: {
        flexDirection: 'row'
    },
    newsImg: {
        ...theme.cardImageStyle,
        flex: 0,
        height: 40,
        width: 60
    },
    newsText: {
        flex: 1,
        alignSelf: 'center',
        paddingLeft: 20,
        color: colors.TextDefault
    }
});
