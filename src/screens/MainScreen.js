import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
  findNodeHandle,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {colorsFromUrl} from 'react-native-dominant-color';
import LinearGradient from 'react-native-linear-gradient';
import {Player} from '@react-native-community/audio-toolkit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RadioImageItem from '../components/RadioImageItem';
import axios from 'axios';
import Loading from '../components/Loading';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default class MainScreen extends Component {
  radioPlayer = null;
  indexRadio = 0;
  lastSeekRadio = [];

  constructor(props) {
    super(props);
    this.state = {
      radioData: [],
      currentItem: null,
      currentLightVibrant: null,
      currentDarkVibrant: null,
      currentAverageColor: null,
      playPauseButton: 'play',
      onOffButton: 'Turn On',
      loading: false,
      disableControl: false,
      viewRef: null,
    };
  }

  componentDidMount() {
    this._requestRadioList();
  }

  componentWillUnmount() {
    if (this.radioPlayer) {
      this.radioPlayer.destroy();
    }
    clearInterval(this._interval);
  }

  async _requestRadioList() {
    axios
      .get('http://192.168.1.4/gta')
      .then(response => {
        this.setState({
          radioData: response.data,
        });
        this._setCurrentItem(0);
        this._interval = setInterval(() => {
          this._updateRadioPlayerState();
        }, 500);
      })
      .catch(error => {
        console.warn(error);
      });
  }

  _updateRadioPlayerState() {
    if (this.radioPlayer) {
      switch (this.radioPlayer.state) {
        case -2:
          this.setState({
            playPauseButton: 'play',
            onOffButton: 'Turn On',
            loading: false,
            disableControl: false,
          });
          break;
        case -1:
          this.setState({
            playPauseButton: 'play',
            onOffButton: 'Turn On',
            loading: false,
            disableControl: false,
          });
          break;
        case 0:
          this.setState({
            playPauseButton: 'play',
            onOffButton: 'Turn On',
            loading: false,
            disableControl: false,
          });
          break;
        case 1:
          this.setState({
            playPauseButton: 'pause',
            onOffButton: 'Turn Off',
            loading: true,
            disableControl: true,
          });
          break;
        case 2:
          this.setState({
            playPauseButton: 'pause',
            onOffButton: 'Turn Off',
            loading: false,
            disableControl: false,
          });
          break;
        case 3:
          this.setState({
            playPauseButton: 'pause',
            onOffButton: 'Turn Off',
            loading: false,
            disableControl: false,
          });
          break;
        case 4:
          this.setState({
            playPauseButton: 'pause',
            onOffButton: 'Turn Off',
            loading: false,
            disableControl: false,
          });
          break;
        case 5:
          this.setState({
            playPauseButton: 'play',
            onOffButton: 'Turn Off',
            loading: false,
            disableControl: false,
          });
          break;
        default:
          break;
      }
    }
  }

  _initRadioPlayer() {
    this.state.radioData.map((item, index) => {
      this.lastSeekRadio[index] = (
        Math.random() * (0.0001 - 1.0) +
        1.0
      ).toFixed(4);
    });

    this._reloadRadioPlayer();
  }

  _reloadRadioPlayer() {
    if (this.radioPlayer) {
      this.radioPlayer.destroy();
    }

    this.radioPlayer = new Player(this.state.radioData[this.indexRadio].url, {
      autoDestroy: false,
      continuesToPlayInBackground: true,
    }).prepare(err => {
      if (err) {
        console.warn(err);
      } else {
        this.radioPlayer.looping = true;
        this.radioPlayer.seek(
          this.lastSeekRadio[this.indexRadio] * this.radioPlayer.duration,
        );
        this.radioPlayer.play();

        this.setState({
          playPauseButton: 'pause',
        });
      }
    });
  }

  _playPauseRadio() {
    this.radioPlayer.playPause((err, paused) => {
      if (err) {
        console.warn(err);
      }

      if (paused) {
        this.setState({
          playPauseButton: 'play',
        });
      } else {
        this.setState({
          playPauseButton: 'pause',
        });
      }
    });
  }

  _nextRadio() {
    if (this.radioPlayer) {
      this.lastSeekRadio[this.indexRadio] =
        this.radioPlayer.currentTime / this.radioPlayer.duration;

      if (this.indexRadio < this.state.radioData.length - 1) {
        this.indexRadio += 1;
        this._reloadRadioPlayer();
      } else {
        this.indexRadio = 0;
        this._reloadRadioPlayer();
      }
      this._carousel.snapToNext();
    }
  }

  _previousRadio() {
    if (this.radioPlayer) {
      this.lastSeekRadio[this.indexRadio] =
        this.radioPlayer.currentTime / this.radioPlayer.duration;
      if (this.indexRadio > 0) {
        this.indexRadio -= 1;
        this._reloadRadioPlayer();
      } else {
        this.indexRadio = this.state.radioData.length - 1;
        this._reloadRadioPlayer();
      }
      this._carousel.snapToPrev();
    }
  }

  _turnOnOffRadio() {
    if (this.radioPlayer) {
      this.radioPlayer.destroy();
    } else {
      this._initRadioPlayer();
    }
  }

  _renderItem({item, index}, parallaxProps) {
    return (
      <RadioImageItem
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
      />
    );
  }

  _getImageColor(index) {
    colorsFromUrl(this.state.radioData[index].image, (err, colors) => {
      if (!err) {
        this.setState({
          currentLightVibrant: colors.lightVibrantColor,
          currentDarkVibrant: colors.darkVibrantColor,
          currentAverageColor: colors.averageColor,
        });
      } else {
        console.warn(err);
      }
    });
    this.setState({viewRef: findNodeHandle(this.background)});
  }

  _setCurrentItem(index) {
    if (this.state.currentItem) {
    }
    this.setState({
      currentItem: this.state.radioData[index],
    });
    this._getImageColor(index);
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'azure'}}>
        <LinearGradient
          style={styles.ellipseBackground}
          start={{x: 0.0, y: 0.25}}
          end={{x: 0.5, y: 1.0}}
          locations={[0, 0.7, 0.9]}
          colors={[
            this.state.currentLightVibrant || '#4c669f',
            this.state.currentDarkVibrant || '#3b5998',
            this.state.currentAverageColor || '#192f6a',
          ]}
        />

        <View>
          <Carousel
            ref={c => {
              this._carousel = c;
            }}
            data={this.state.radioData}
            renderItem={this._renderItem}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            hasParallaxImages={true}
            firstItem={0}
            inactiveSlideScale={0.94}
            inactiveSlideOpacity={0.7}
            inactiveSlideShift={20}
            containerCustomStyle={styles.slider}
            contentContainerCustomStyle={styles.sliderContentContainer}
            loop={true}
            loopClonesPerSide={2}
            autoplay={false}
            onSnapToItem={index => this._setCurrentItem(index)}
          />
          <Loading visible={this.state.loading} />
        </View>

        <View style={styles.playerControlContainer}>
          <View style={{marginBottom: 34, alignItems: 'center'}}>
            <TouchableOpacity
              disabled={this.state.disableControl}
              onPress={() => this._turnOnOffRadio()}>
              <LinearGradient
                style={styles.onOffButtonControl}
                start={{x: 0, y: 1}}
                end={{x: 0, y: 0}}
                colors={['#3f9dff', '#6ec8ff']}>
                <Icon name="power-standby" size={32} color="white" />
                <Text
                  style={{
                    color: 'white',
                    fontSize: 18,
                    fontWeight: '500',
                    marginLeft: 16,
                  }}>
                  {this.state.onOffButton}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.buttonControlContainer}>
              <TouchableOpacity
                disabled={this.state.disableControl}
                onPress={() => this._previousRadio()}>
                <LinearGradient
                  style={styles.smallButtonControl}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#6ec8ff', '#3f9dff']}>
                  <Icon name="skip-previous" size={32} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonControlContainer}>
              <TouchableOpacity
                disabled={this.state.disableControl}
                onPress={() => this._playPauseRadio()}>
                <LinearGradient
                  style={styles.bigButtonControl}
                  start={{x: 0, y: 1}}
                  end={{x: 0, y: 0}}
                  colors={['#3f9dff', '#6ec8ff']}>
                  <Icon
                    name={this.state.playPauseButton}
                    size={64}
                    color="white"
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonControlContainer}>
              <TouchableOpacity
                disabled={this.state.disableControl}
                onPress={() => this._nextRadio()}>
                <LinearGradient
                  style={styles.smallButtonControl}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#3f9dff', '#6ec8ff']}>
                  <Icon name="skip-next" size={32} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ellipseBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    // height: viewportHeight * 0.5,
    // borderBottomStartRadius: ((viewportHeight + viewportWidth) / 2) * 0.5,
    // borderBottomEndRadius: ((viewportHeight + viewportWidth) / 2) * 0.5,
    // transform: [{scaleX: 1.5}],
    // overflow: 'hidden',
  },
  slider: {
    marginTop: 15,
    overflow: 'visible', // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 10, // for custom animation
  },
  playerControlContainer: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    right: 16,
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
    borderRadius: 16,
    padding: 8,
  },
  buttonControlContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallButtonControl: {
    width: 64,
    height: 64,
    borderRadius: 32,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigButtonControl: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'red',
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onOffButtonControl: {
    height: 48,
    width: 150,
    borderRadius: 32,
    alignItems: 'center',
    paddingHorizontal: 8,
    flexDirection: 'row',
    elevation: 2,
  },
});
