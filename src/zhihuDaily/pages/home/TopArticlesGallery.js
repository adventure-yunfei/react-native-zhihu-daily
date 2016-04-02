import React, {
    PropTypes,
    StyleSheet,
    Text,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import immutable from 'immutable';
import Carousel from 'react-native-looped-carousel';
import LinearGradient from 'react-native-linear-gradient';

import Component from '../../../Component';
import * as windowSize from '../../../lib/windowSize';
import * as colors from '../../../colors';

export const GalleryHeight = 240;

export default class TopArticlesGallery extends Component {
    static propTypes = {
        topArticles: PropTypes.instanceOf(immutable.List).isRequired,
        jumpToArticle: PropTypes.func.isRequired
    };

    render() {
        const {topArticles, jumpToArticle} = this.props;

        return (
            <Carousel style={styles.scrollContainer} autoplay={true}>
                {topArticles && topArticles.map(topArticle => {
                    const id = topArticle.get('id');
                    return (
                        <TouchableWithoutFeedback key={id} onPress={() => jumpToArticle(id)}>
                            <Image style={styles.topNewsImage} source={{uri: topArticle.get('image') || 'TODO_DEFAULT'}}>
                                <LinearGradient style={styles.topNewsTextGradient} colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)']}>
                                    <Text style={styles.topNewsText}>{topArticle.get('title')}</Text>
                                </LinearGradient>
                            </Image>
                        </TouchableWithoutFeedback>
                    );
                }).toJS()}
            </Carousel>
        );
    }
}

const styles = StyleSheet.create({
    scrollContainer: {
        height: GalleryHeight,
        backgroundColor: '#eee'
    },

    topNewsImage: {
        height: GalleryHeight,
        justifyContent: 'flex-end'
    },
    topNewsTextGradient: {
        height: 65
    },
    topNewsText: {
        position: 'absolute',
        bottom: 0,
        width: windowSize.width,
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 5,
        paddingBottom: 10,
        fontSize: 19,
        lineHeight: 22,
        color: colors.White,
        backgroundColor: 'transparent'
    }
});
