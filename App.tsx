
import React, {useCallback, useState} from 'react';
import {Button, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import S3FileScreen from './s3Files';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Welcome'}}
        />
        <Stack.Screen name="Directories" component={S3FileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({navigation}) => {
    return (
      <View>
        <Button
          title="See latest directories"
          onPress={() =>
            navigation.navigate('Directories')
          }
        />
      </View>  
    );
  };

export default App;
