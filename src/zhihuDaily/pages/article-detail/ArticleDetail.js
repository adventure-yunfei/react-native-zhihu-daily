import React, {
    PropTypes,
    Component,
    View,
    WebView,
    StyleSheet
} from 'react-native';
import immutable from 'immutable';
import {connect} from 'react-redux';
import Spinner from 'react-native-material-kit/lib/mdl/Spinner';

import * as actions from './actions';
import {STATUS_BAR_HEIGHT} from '../../../variables';

const getStyleLinkNode = href => `<link rel="stylesheet" href="${href}"/>`;
const getJSNode = src => `<script type="text/javascript" src="${src}"></script>`;

class ArticleDetail extends Component {
    static propTypes = {
        articleId: PropTypes.number.isRequired,
        article: PropTypes.instanceOf(immutable.Map),
        dispatch: PropTypes.func.isRequired
    };

    componentWillMount() {
        this.props.dispatch(
            actions.getArticle(this.props.articleId)
        );
    }

    componentWillUnmount() {
        this.props.dispatch(actions.clear());
    }

    render() {
        const {article} = this.props,
            renderContent = () => {
                const html =
                    (article.get('css') || immutable.List()).map(getStyleLinkNode).join('')
                    + `<style>.headline .img-place-holder { background-image: url(${article.get('image')}); background-size: 100% auto; background-repeat: no-repeat; background-position: center;}</style>`
                    + article.get('body')
                    + (article.get('js') || immutable.List()).map(getJSNode).join('');

                return <WebView source={{html: html}}/>;
            };

        return (
            <View style={styles.page}>
                {article ? renderContent() : <Spinner style={styles.spinner}/>}
            </View>
        );
    }
}

export default connect(state => ({
    article: state.get('article')
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
