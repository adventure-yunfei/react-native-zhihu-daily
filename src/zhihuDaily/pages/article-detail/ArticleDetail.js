import React, {
    PropTypes,
    View,
    Text,
    WebView,
    Image,
    TouchableHighlight,
    Navigator,
    StyleSheet
} from 'react-native';
import immutable from 'immutable';
import {connect} from 'react-redux';
import Spinner from 'react-native-material-kit/lib/mdl/Spinner';
import Color from 'color';

import Component from '../../../Component';
import {GalleryHeight} from '../home/TopArticlesGallery';
import Comments from '../comments/Comments';
import * as actions from './actions';
import * as colors from '../../../colors';
import {STATUS_BAR_HEIGHT} from '../../../variables';

const getStyleLinkNode = href => `<link rel="stylesheet" href="${href}"/>`;
const getJSNode = src => `<script type="text/javascript" src="${src}"></script>`;

class ArticleDetail extends Component {
    static propTypes = {
        articleId: PropTypes.number.isRequired,
        content: PropTypes.instanceOf(immutable.Map),
        extra: PropTypes.instanceOf(immutable.Map),
        comments: PropTypes.instanceOf(immutable.List),
        dispatch: PropTypes.func.isRequired,
        navigator: PropTypes.instanceOf(Navigator).isRequired
    };

    jumpToComment = () => {
        const {articleId, navigator} = this.props;
        navigator.push({
            component: Comments,
            props: {
                articleId
            }
        });
    };

    componentWillMount() {
        const {dispatch, articleId} = this.props;
        dispatch(actions.getArticle(articleId));
        dispatch(actions.getArticleExtra(articleId));
    }

    componentWillUnmount() {
        this.props.dispatch(actions.clear());
    }

    render() {
        const {content, extra} = this.props,
            renderContent = () => {
                const html =
                    (content.get('css') || immutable.List()).map(getStyleLinkNode).join('')
                    + `<style>.headline .img-place-holder { height: ${GalleryHeight}px; background-image: url(${content.get('image')}); background-size: 100% auto; background-repeat: no-repeat; background-position: center;}</style>`
                    // 滚动超出图片时, 显示白色条遮住状态栏
                    + `<div id="status-bar" style="position: fixed; top: 0; width: 100%; height: ${STATUS_BAR_HEIGHT}; background-color: #fff; opacity: 0;"></div>`
                    + `<script>window.addEventListener("scroll", function () { document.querySelector("#status-bar").style.opacity = window.scrollY > ${GalleryHeight} ? 1 : 0; });</script>`
                    + content.get('body')
                    + (content.get('js') || immutable.List()).map(getJSNode).join('');

                return <WebView source={{html: html}}/>;
            };

        return (
            <View style={styles.page}>
                {content ? renderContent() : <Spinner style={styles.spinner}/>}

                <View style={styles.tabBar}>
                    <TouchableHighlight onPress={this.jumpToComment}
                                        underlayColor={Color(colors.Grey).alpha(0.1).rgbaString()}
                                        style={styles.tabBarItemWrapper}>
                        <View style={styles.tabBarItem}>
                            <Image source={require('./images/ic_comment.png')} style={styles.tabBarItemImg}/>
                            <Text style={styles.tabBarItemText}>{extra && extra.get('comments')}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

export default connect(state => ({
    content: state.getIn(['article', 'content']),
    extra: state.getIn(['article', 'extra']),
    comments: state.getIn(['article', 'comments'])
}))(ArticleDetail);

const styles = StyleSheet.create({
    page: {
        flex: 1
    },

    spinner: {
        marginTop: 50,
        alignSelf: 'center'
    },

    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'flex-end',
        height: 25
    },
    tabBarItemWrapper: {
        marginRight: 16
    },
    tabBarItem: {
        width: 50,
        flexDirection: 'row',
        alignItems: 'center'
    },
    tabBarItemImg: {
        opacity: 0.6
    },
    tabBarItemText: {
        flex: 1,
        textAlign: 'center',
        color: colors.TextDefault
    }
});
