import React, {useCallback, useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import {
  S3Client,
  ListObjectsV2Command
} from '@aws-sdk/client-s3';
import {fromCognitoIdentityPool} from '@aws-sdk/credential-providers';

const client = new S3Client({
  // The AWS Region where the Amazon Simple Storage Service (Amazon S3) bucket will be created. Replace this with your Region.
  region: 'us-east-1',
  credentials: fromCognitoIdentityPool({
    // Replace the value of 'identityPoolId' with the ID of an Amazon Cognito identity pool in your Amazon Cognito Region.
    identityPoolId: 'us-east-1:95494d53-3aee-40ed-bf4d-7209bd3ae750',
    // Replace the value of 'region' with your Amazon Cognito Region.
    clientConfig: {region: 'us-east-1'},
  }),
});

enum MessageType {
  SUCCESS,
  FAILURE,
  EMPTY,
}

const App = () => {
  const [bucketName, setBucketName] = useState('');
  const [msg, setMsg] = useState<{message: string; type: MessageType}>({
    message: '',
    type: MessageType.EMPTY,
  });

  const listBucket = useCallback(async () => {
    setMsg({message: '', type: MessageType.EMPTY});
    const defaultBucketName = "door-images"

    try {
      const input = {
        Bucket: bucketName,
        // Prefix: "20230813",
        // MaxKeys: 10
      }
      const listResults = await client.send(new ListObjectsV2Command(input));
      var fileNames = ""
      var pathList = new Set()
      listResults.Contents?.forEach((val) => pathList.add(`${val.Key}`.slice(0,17)))
      pathList.forEach((val) => fileNames += `\t${val}\n`)

      setMsg({
        message: `Openings: \n${fileNames}`,
        type: MessageType.SUCCESS,
      });
    } catch (e) {
      console.error(e);
      setMsg({
        message: e instanceof Error ? e.message : 'Unknown error',
        type: MessageType.FAILURE,
      });
    }
  }, [bucketName]);

  return (
    <View style={styles.container}>
      <View style={titleStyle.container}>
        <Text style={titleStyle.text}>
          Door Opening Times
        </Text>
      </View>
      <View style={styles.container}>
        {msg.type !== MessageType.EMPTY && (
          <Text
            style={
              msg.type === MessageType.SUCCESS
                ? styles.successText
                : styles.failureText
            }>
            {msg.message}
          </Text>
        )}
      </View>
      <View style={styles.container}>
        <TextInput
          onChangeText={text => setBucketName(text)}
          autoCapitalize={'none'}
          value={bucketName}
          placeholder={'Enter Bucket Name'}
        />
        <Button color="#68a0cf" title="List Bucket" onPress={listBucket} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
  },
  successText: {
    color: 'green',
  },
  failureText: {
    color: 'red',
  },
});

const titleStyle = StyleSheet.create({
  container: {
    justifyContent: 'center',
    textAlignVertical: 'top',
  },
  text: {
    color: 'red',
  },
});

export default App;
