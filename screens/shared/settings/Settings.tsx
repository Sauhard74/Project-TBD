import { captureException } from '@sentry/react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../../components/headers/Header';
import { AuthContext, tokenPayloadKey } from '../../../context/AuthContext';
import { useDispatch } from 'react-redux';
import { showToast } from '../../../redux/reducers/toast';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CustomAvatar from '../../../components/layout/CustomAvatar';
import { Icon } from '@rneui/themed';
import { modifyParent } from '../../../apis/Parent';
import { modifyStaff } from '../../../apis/Staff';
import { textStyle } from '../../../constants/GlobalStyles';
import {
  chooseFile,
  backgroundUploadToGoogleStorage
} from '../../../utilities/MultiMediaActionsUtil';
import useSWR from 'swr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserDetailsV2 } from '../../../apis/User';
import { logOut } from '../../../utilities/user.utils';
import { env } from '../../../../environment';

const Settings = ({ navigation }: NativeStackScreenProps<any>) => {
  const { isParent } = useContext(AuthContext);
  const [token, setToken] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const chosenPromise = isParent ? modifyParent : modifyStaff;
  const dispatch = useDispatch();

  // get token from AsyncStorage
  async function getToken() {
    const token = isParent
      ? await AsyncStorage.getItem('parent_token')
      : await AsyncStorage.getItem('staff_token');
    return token;
  }

  const { data: userFetchData, mutate: refreshUserData } = useSWR(
    ['user-details', token],
    () =>
      token
        ? fetchUserDetailsV2(isParent ? tokenPayloadKey.parent : tokenPayloadKey.staff, token)
        : null,
    {
      onError: (error) => {
        captureException(error);
        console.log('error', error);
      }
    }
  );

  useEffect(() => {
    getToken()
      .then((token) => token && setToken(token))
      .catch((error) => captureException(error));
  }, []);

  useEffect(() => {
    if (userFetchData) {
      const userDetails = isParent
        ? userFetchData?.parent_user?.user_details
        : userFetchData?.staff_user?.user_details;

      setUserId(userDetails?._id.$oid);
      setName(userDetails?.first_name + ' ' + userDetails?.last_name);
      setEmail(userDetails?.email || userDetails?.primary_email);
      setProfilePicture(
        isParent ? userDetails?.parent_profile_picture : userDetails?.staff_profile_picture
      );
      setPhoneNumber(userDetails?.primary_phone || userDetails?.phone);
    }
  }, [userFetchData]);

  async function selectProfilePicture() {
    try {
      // get the image from device media picker
      const [cancelled, image] = await chooseFile(1, 'photo');

      if (!cancelled && image && image[0]) {
        // upload the image and get the link
        const imageLink = await backgroundUploadToGoogleStorage(image[0], 'miscellaneous');

        // if image upload failed
        if (!imageLink) {
          dispatch(
            showToast({
              text: 'Failed to upload the image. Please try again later.',
              type: 'error'
            })
          );
          return;
        }

        // update the user profile picture
        await chosenPromise(
          userId,
          isParent
            ? { parent_profile_picture: imageLink }
            : {
                staff_profile_picture: imageLink
              }
        )
          .then(() => {
            dispatch(showToast({ text: 'Profile picture changed', type: 'success' }));
            refreshUserData();
          })
          .catch((error) => {
            captureException(error);
            dispatch(
              showToast({
                text:
                  error?.response?.data['error message'] ||
                  'Something went wrong. Please try again later.',
                type: 'error'
              })
            );
          });
      }
    } catch (error) {
      captureException(error);
    }
  }

  async function updatePhoneNumber() {
    await chosenPromise(userId, isParent ? { primary_phone: phoneNumber } : { phone: phoneNumber })
      .then(() => {
        setEditMode(false);
        refreshUserData();
        dispatch(showToast({ text: 'Phone number updated successfully', type: 'success' }));
      })
      .catch((error) => {
        captureException(error);
        dispatch(
          showToast({
            text: error?.response?.data['error message'] || 'Please try again later.',
            type: 'error'
          })
        );
      });
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title={'Settings'} onPress={() => navigation.navigate('Dashboard')} />

      <View className="flex-row space-x-6 p-8">
        {/* Avatar */}
        <TouchableOpacity onPress={selectProfilePicture} className="relative">
          <CustomAvatar uploadedImage={profilePicture} size={80} />

          <View className="absolute left-0 top-0 h-20 w-20 items-center justify-center rounded-full bg-black/25">
            <Icon name="pencil-alt" type="font-awesome-5" size={16} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Name */}
        <View className="justify-center">
          <Text className="text-2xl" style={textStyle(24, '600')}>
            {name}
          </Text>
          <Text style={textStyle(16, '400', '#777')}>{isParent ? 'Parent' : 'Educator'}</Text>
        </View>
      </View>

      {/* User Details */}
      <View className="space-y-5 px-6">
        {/* Email */}
        <View className="space-y-1">
          <Text style={textStyle(16, '400', '#777')}>email</Text>
          <Text style={textStyle(16, '500')}>{email}</Text>
        </View>

        {/* Phone */}
        <View className="space-y-1">
          <Text style={textStyle(16, '400', '#777')}>phone</Text>
          <View className="flex-row items-center justify-between">
            {editMode ? (
              <View className="flex-row items-center space-x-4">
                <TextInput
                  style={textStyle(16)}
                  className="flex-1 rounded-lg border border-light_grey px-4 py-2.5"
                  placeholder="Enter phone number"
                  placeholderTextColor="gray"
                  value={phoneNumber}
                  onChangeText={(text) => setPhoneNumber(text)}
                  maxLength={10}
                  autoFocus
                  keyboardType="phone-pad"
                />
                <TouchableOpacity
                  onPress={updatePhoneNumber}
                  disabled={phoneNumber ? phoneNumber?.length !== 10 : true}
                  className="inline-block rounded-lg bg-primary px-4 py-2">
                  <Text className="text-base font-semibold text-white">Update</Text>
                </TouchableOpacity>
              </View>
            ) : phoneNumber ? (
              <>
                <Text style={textStyle(16, '500')}>{phoneNumber}</Text>
                <TouchableOpacity onPress={() => setEditMode(true)}>
                  <Text style={textStyle(16, '600', '#3b82f6')}>Modify</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={() => setEditMode(true)} className="pt-2">
                <Text className="text-base font-semibold text-blue-500">Add phone number</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Divider */}
      <View className="mx-6 my-8 h-px bg-light_grey" />

      {/* Actions */}
      <View className="space-y-8 px-6">
        {/* Advanced Options */}
        <TouchableOpacity
          onPress={() => navigation.navigate('AdvancedSettings')}
          className="flex-row items-center justify-between">
          <Text style={textStyle(16, '500', '#777')}>Advanced Options</Text>
          <Icon name="chevron-forward-outline" type="ionicon" size={20} color="#333" />
        </TouchableOpacity>

        {/* Log Out */}
        <TouchableOpacity onPress={() => logOut()} className="flex-row items-center space-x-2">
          <Icon name="log-out-outline" type="ionicon" size={28} color="#333" />
          <Text style={textStyle(16, '500')}>Log out</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="mb-4 mt-auto">
        <Text style={textStyle(16, '500', '#777')} className="text-center">
          Agastya v{env.appVersion}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
