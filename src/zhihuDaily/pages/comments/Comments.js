import React, {
    PropTypes,
    View,
    Text,
    ListView,
    Image,
    StyleSheet
} from 'react-native';
import immutable from 'immutable';
import {connect} from 'react-redux';

import Component from '../../../Component';
import {formatDate} from '../../../date-format';
import * as colors from '../../../colors';
import {STATUS_BAR_HEIGHT} from '../../../variables';
import * as STYLES from '../../commonStyles';
import * as articleActions from '../article-detail/actions';

class Comments extends Component {
    static propTypes = {
        articleId: PropTypes.number.isRequired,
        extra: PropTypes.instanceOf(immutable.Map),
        comments: PropTypes.instanceOf(immutable.List),
        dispatch: PropTypes.func.isRequired
    };

    constructor() {
        super(...arguments);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            dataSource: dataSource.cloneWithRows([])
        };
    }

    componentWillMount() {
        const {extra, articleId, dispatch} = this.props;

        dispatch(articleActions.getArticleComments(articleId));
        if (!extra) {
            dispatch(articleActions.getArticleExtra(articleId));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.comments !== this.props.comments) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(Array.from(nextProps.comments))
            });
        }
    }

    render() {
        const {extra} = this.props,
            {dataSource} = this.state,
            renderRow = comment => {
                return (
                    <View style={styles.comment}>
                        <Image style={styles.commentAvatar} source={{uri: comment.get('avatar')}}/>
                        <View style={STYLES.flex_1}>
                            <Text style={styles.commentAuthorText}>{comment.get('author')}</Text>
                            <Text style={styles.commentContentText}>{comment.get('content')}</Text>
                            <Text style={styles.commentTimeText}>{formatDate(new Date(comment.get('time') * 1000), 'MM-dd HH:mm')}</Text>
                        </View>
                    </View>
                );
            };

        return (
            <View style={styles.listViewContainer}>
                <ListView
                    dataSource={dataSource}
                    renderHeader={() => <View style={styles.listViewHead}><Text>{extra && (extra.get('comments') + ' 条评论')}</Text></View>}
                    renderRow={renderRow}
                    style={STYLES.flex_1}
                />
            </View>
        );
    }
}

export default connect(state => ({
    extra: state.getIn(['article', 'extra']),
    comments: state.getIn(['article', 'comments'])
}))(Comments);

const styles = StyleSheet.create({
    listViewContainer: {
        flex: 1,
        paddingTop: STATUS_BAR_HEIGHT,
        backgroundColor: colors.White
    },

    listViewHead: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: colors.Border
    },

    comment: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: colors.Border
    },
    commentAvatar: {
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 20
    },
    commentAuthorText: {
        fontWeight: 'bold'
    },
    commentContentText: {
        paddingTop: 5,
        paddingBottom: 5
    },
    commentTimeText: {
        fontSize: 11,
        color: colors.TextLight
    }
});
