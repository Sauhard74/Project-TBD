import * as Sentry from '@sentry/react-native';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import React, { useContext, useState } from 'react';
import Header from '../../../components/headers/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { deleteUserAccount } from '../../../apis/User';
import { AuthContext } from '../../../context/AuthContext';
import { showToast } from '../../../redux/reducers/toast';
import { logOut } from '../../../utilities/user.utils';
import { textStyle } from '../../../constants/GlobalStyles';

const AdvancedSettings = ({ navigation }: NativeStackScreenProps<any>) => {
  const [confirmation, setConfirmation] = useState('');

  const dispatch = useDispatch();

  const handleDeleteAccount = async () => {
    try {
      const response = await deleteUserAccount();
      if (response.result && !!logOut) {
        dispatch(showToast({ text: 'Account deleted successfully', type: 'success' }));
        logOut();
      } else {
        dispatch(showToast({ text: 'Failed! Please try again', type: 'error' }));
      }
    } catch (error) {
      Sentry.captureException(error);
      dispatch(showToast({ text: 'Failed! please try again', type: 'error' }));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={'Advanced Settings'} onPress={() => navigation.goBack()} />

      <View className="space-y-2 px-6 py-8">
        <Text className="text-lg font-semibold text-primary">Delete Account</Text>
        <Text style={textStyle(14, '400', '#777')}>
          This action will delete your account and all associated data. This action cannot be
          undone. Are you sure you want to delete your account?
        </Text>

        <View />

        <Text className="font-medium text-dark_grey">Type 'DELETE' below to confirm</Text>
        <TextInput
          style={textStyle(16)}
          className="rounded-lg border border-light_grey px-4 py-2"
          placeholder="DELETE"
          placeholderTextColor="gray"
          value={confirmation}
          onChangeText={(text) => setConfirmation(text.toUpperCase())}
        />

        <View />

        <TouchableOpacity
          onPress={handleDeleteAccount}
          disabled={confirmation !== 'DELETE'}
          className="inline-block rounded-lg bg-red-500 px-4 py-2">
          <Text className="text-base font-semibold text-white">Delete Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AdvancedSettings;
