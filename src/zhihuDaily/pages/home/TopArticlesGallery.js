import React, {
    PropTypes,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import Color from 'color';
import immutable from 'immutable';
import Carousel from 'react-native-looped-carousel';

import Component from '../../../Component';
import * as windowSize from '../../../lib/windowSize';
import * as colors from '../../../colors';

export const GalleryHeight = 150;

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
                            <View>
                                <Image style={styles.topNewsImage} source={{uri: topArticle.get('image') || 'TODO_DEFAULT'}}/>
                                <Text style={styles.topNewsText}>{topArticle.get('title')}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                }).toJS()}
            </Carousel>
        );
    }
}

const styles = StyleSheet.create({
    scrollContainer: {
        height: GalleryHeight
    },

    topNewsImage: {
        height: GalleryHeight
    },
    topNewsText: {
        position: 'absolute',
        bottom: 0,
        width: windowSize.width,
        textAlign: 'center',
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 5,
        paddingBottom: 10,
        color: colors.White,
        backgroundColor: Color(colors.Dark).alpha(0.3).rgbaString()
    }
});
