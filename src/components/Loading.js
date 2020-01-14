import React from 'react';
import {View, Text, Animated, Easing} from 'react-native';

const spinValue = new Animated.Value(0);

Animated.loop(
  Animated.timing(spinValue, {
    toValue: 1,
    duration: 1000,
    easing: Easing.linear,
    useNativeDriver: true,
  }),
).start();

const spin = spinValue.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg'],
});

const Loading = ({visible}) =>
  visible ? (
    <View
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: 120,
          height: 120,
          backgroundColor: 'rgba(52, 52, 52, 0.8)',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 16,
          marginBottom: 64,
        }}>
        <Animated.Image
          style={{width: 70, height: 70, transform: [{rotate: spin}]}}
          source={require('../assets/images/loading_bar_circle.png')}
        />
        <Text style={{color: 'white', fontSize: 18}}>Please Wait</Text>
      </View>
    </View>
  ) : null;

export default Loading;
