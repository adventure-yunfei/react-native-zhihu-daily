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
                    + `<style>.headline .img-place-holder { background-image: url(${content.get('image')}); background-size: 100% auto; background-repeat: no-repeat; background-position: center;}</style>`
                    + content.get('body')
                    + (content.get('js') || immutable.List()).map(getJSNode).join('');

                return <WebView source={{html: html}}/>;
            };

        return (
            <View style={styles.page}>
                {content ? renderContent() : <Spinner style={styles.spinner}/>}

                <View style={{flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'flex-end', height: 25}}>
                    <TouchableHighlight onPress={this.jumpToComment}
                                        underlayColor={Color(colors.Grey).alpha(0.1).rgbaString()}
                                        style={{marginRight: 16}}>
                        <View style={{width: 50, flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={require('./images/ic_comment.png')} style={{opacity: 0.6}}/>
                            <Text style={{flex: 1, textAlign: 'center', color: colors.TextDefault}}>{extra && extra.get('comments')}</Text>
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
        flex: 1,
        paddingTop: STATUS_BAR_HEIGHT
    },

    spinner: {
        marginTop: 50,
        alignSelf: 'center'
    }
});
