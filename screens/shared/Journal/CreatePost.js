import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Image, Platform, TouchableOpacity } from 'react-native';
import { GlobalStyles, textStyle } from '../../../constants/GlobalStyles';
import Header from '../../../components/headers/Header';
import ImageViewer from '../../../components/layout/ImageViewer';
import CustomBottomSheet from '../../../components/layout/CustomBottomSheet';
import { Colors } from '../../../constants/Colors';
import { Icon } from '@rneui/themed';
import CustomDescription from '../../../components/inputs/CustomDescription';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomSubmit from '../../../components/buttons/CustomSubmit';
import * as yup from 'yup';
import { Formik } from 'formik';
import { fetchClassActivities, fetchClassDetails } from '../../../apis/Classes';
import { createJournal, createJournalFromMedia } from '../../../apis/Journal';
import ImagePickerSheet from '../../../components/bottomsheet/ImagePickerSheet';
import { AuthContext, mixpanel } from '../../../context/AuthContext';
import SingleSelect from '../../../components/dropdowns/SingleSelect';
import {
  captureImage,
  chooseFile,
  generatedMediaLinksFromGCP,
  numGCPMediaUploadedSuccessfully
} from '../../../utilities/MultiMediaActionsUtil';
import MultiSelectDropdown from '../../../components/dropdowns/multi';
import PrivacyLevelDropdown from '../../../components/dropdowns/PrivacyLevel';
import * as Sentry from '@sentry/react-native';
import { useDispatch } from 'react-redux';
import { showToast } from '../../../redux/reducers/toast';
import {
  CameraActionsLayout,
  MediaProcessingLayout
} from '../../../components/layout/MediaActions';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import { MixedLoginContext } from '../../../context/MixedLoginContext';
import SwipeGestureView from '../../../components/custom/gesture/SwipeGestureView';
import { CommonActions } from '@react-navigation/native';
import uuid from 'react-native-uuid';

const CreatePost = ({ navigation, route }) => {
  const { classId, isParent } = useContext(AuthContext);
  const { childId } = useContext(MixedLoginContext);
  const imageSheetRef = useRef(null);
  const imageSnapPoints = ['23%'];
  const [loader, setLoader] = useState(false);
  const [privacyLevel, setPrivacyLevel] = useState();
  const [activity, setActivity] = useState('');
  const [students, setStudents] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [journalMedia, setJournalMedia] = useState([]);
  const [showAndroidCameraActions, setShowAndroidCameraActions] = useState(false); // For android devices, user must choose when clicked on camera option for either capturing video or image
  const formRef = useRef();
  const dispatch = useDispatch();
  const [isUploading, setIsUploading] = useState(false);

  const validate = yup.object().shape({
    caption: yup.string()
  });

  const initialValues = {
    caption: '',
    media: []
  };

  useEffect(() => {
    getStudentsList();
    getActivitiesList();
    mixpanel.track('Page - Create Journal');
  }, []);

  // when creating a journal post from the media
  useEffect(() => {
    if (route?.params?.journalMedia) {
      const target = route.params.journalMedia;
      setJournalMedia(target?.media_data);
      setStudents(target?.tagged_students);
    }
  }, [route?.params?.journalMedia]);

  const handleOpenSheet = async () => {
    await imageSheetRef.current?.snapToIndex(0);
  };

  const handleCloseSheet = async () => {
    await imageSheetRef.current?.close();
  };

  const selectMedia = async (type, cameraAction) => {
    // The max images to be selected when creating a journal post
    const selectionLimit = 10 - journalMedia.length;
    handleCloseSheet();
    setIsUploading(true);
    const [didCancel, data] =
      type === 'camera'
        ? Platform.OS === 'ios'
          ? await captureImage(selectionLimit, 'mixed')
          : await captureImage(selectionLimit, cameraAction)
        : await chooseFile(selectionLimit, 'mixed');
    !didCancel && setJournalMedia((prev) => [...prev, ...data]);
    setIsUploading(false);
  };

  const removeImage = (url) => {
    const list = journalMedia.filter((item) => item.uri != url);
    setJournalMedia(list);
  };

  const getStudentsList = async () => {
    try {
      const list = [];
      const response = await fetchClassDetails(classId);
      if (response.my_class) {
        response.my_class.student_list.forEach((item) => {
          list.push({
            label: `${item.first_name} ${item.last_name != null ? item.last_name : ''}`,
            id: item._id.$oid
          });
        });
        setStudentsList(list);
      }
    } catch (err) {
      Sentry.captureException(err);
    }
  };

  const getActivitiesList = async () => {
    try {
      const list = [];
      const response = await fetchClassActivities(classId);
      if (response.result) {
        response.result.forEach((item) => {
          list.push({
            value: item.title || 'No Title',
            key: item._id.$oid
          });
        });
        setActivityList(list);
      }
    } catch (err) {
      Sentry.captureException(err);
    }
  };

  const handleCameraAction = (type) => {
    if (type === 'photo') {
      selectMedia('camera', 'photo');
    } else if (type === 'video') {
      selectMedia('camera', 'video');
    }
    setShowAndroidCameraActions(false);
  };
  const navBack = (state) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'JournalList', params: { nofetch: state } }]
      })
    );
  };

  const handleCreatePost = async (values) => {
    setLoader(true);
    const data = {};
    data.class_id = classId;
    data.caption = values.caption;
    try {
      if (!isParent) {
        if (activity) data.post_activities = [activity];
        if (students.length > 0) data.tagged_students = students;
        if (privacyLevel) data.privacy_level = privacyLevel;
      } else {
        data.tagged_students = [childId];
        data.privacy_level = `Student's Family`;
      }

      if (journalMedia.length > 0 && !route?.params?.journalMedia) {
        const multimedia = true; // indicates user can upload both videos and images
        data.media = await generatedMediaLinksFromGCP(journalMedia, 'journal', multimedia); // passing the parameter for indicating multimedia is true for gcp links creation utility function
      } else if (route?.params?.journalMedia) {
        data.media_ids = route.params.journalMedia?.media_ids;
      }

      let response;
      if (route?.params?.journalMedia) {
        response = await createJournalFromMedia(classId, data);
      } else {
        // If even 1 media failed to upload, show toast that media upload failed
        if (numGCPMediaUploadedSuccessfully(data.media) == journalMedia.length) {
          response = await createJournal(data);
        } else {
          dispatch(showToast({ text: 'Failed to upload medias! Please try again', type: 'error' }));
          setLoader(false);
          return;
        }
      }
      if (response.result) {
        navBack(false);
        dispatch(showToast({ text: 'Post created successfully', type: 'success' }));
      } else {
        dispatch(showToast({ text: 'Failed! Please try again ', type: 'error' }));
      }
    } catch (err) {
      dispatch(showToast({ text: 'Failed! Please try again', type: 'error' }));
      Sentry.captureException(err);
    } finally {
      // Ensure loader is reset in all cases
      setLoader(false);
    }
  };

  const getSwipeableJournalMedia = () => {
    const journalMediaList = journalMedia.map((el) => ({
      ...el,
      _id: { $oid: uuid.v4() },
      media_faces: []
    }));
    return journalMediaList;
  };

  // function to navigate & display media in full screen
  const mediaFullScreenViewer = (item, id, allMedia) => {
    navigation.navigate('MediaView', {
      media: {
        ...item,
        media_faces: [],
        _id: { $oid: id }
      },
      mediaList: allMedia,
      source: 'journal'
    });
  };

  // function to toggle full screen for images & videos
  const toggleImageVideoViewer = (item) => {
    const swipeableJournalMedia = getSwipeableJournalMedia();
    const selectedMediaId = swipeableJournalMedia.find((el) => el.uri == item.uri)?._id?.$oid;
    mediaFullScreenViewer(
      item,
      selectedMediaId,
      swipeableJournalMedia.map((item) => {
        return {
          ...item,
          media_link: item.uri,
          media_type: item.type
        };
      })
    );
  };

  return (
    <SwipeGestureView navigation={navigation} targetScreen={'JournalList'}>
      <Header title={'Create New Post'} onPress={() => navBack(true)} />
      <View style={{ margin: 5 }} />

      {showAndroidCameraActions && (
        <CameraActionsLayout
          onPressPicture={() => handleCameraAction('photo')}
          onPressVideo={() => handleCameraAction('video')}
          onPressCancel={() => setShowAndroidCameraActions(false)}
        />
      )}

      <Formik
        innerRef={formRef}
        validationSchema={validate}
        initialValues={initialValues}
        onSubmit={(values) => handleCreatePost(values)}>
        {({ handleSubmit, handleChange, values, errors, touched }) => {
          return (
            <View style={GlobalStyles.container}>
              <KeyboardAwareScrollView>
                <View style={GlobalStyles.innerContainer}>
                  <View style={{ margin: 10 }} />
                  {journalMedia.length < 10 && !route?.params?.journalMedia && (
                    <ImageViewer addImage={handleOpenSheet} />
                  )}
                  <View style={styles.imageContainer}>
                    {journalMedia.length > 0 &&
                      journalMedia.map((media, index) => (
                        // Insted of showing the image file name, we are displaying selected images
                        <View key={index} style={styles.mediaContainer}>
                          <TouchableOpacity
                            onPress={() => {
                              toggleImageVideoViewer(media);
                            }}>
                            {media.type?.startsWith('image') || media.thumbnail ? (
                              <FastImage
                                source={{ uri: media.thumbnail ? media.thumbnail : media.uri }}
                                resizeMode="cover"
                                style={styles.imageCtn}></FastImage>
                            ) : (
                              <Video
                                paused
                                style={styles.imageCtn}
                                resizeMode="cover"
                                source={{ uri: media.uri }}
                              />
                            )}
                          </TouchableOpacity>
                          {media.type?.startsWith('video') && (
                            <View style={styles.playButtonContainer}>
                              <Image
                                source={require('../../../assets/video-icons/play-button.png')}
                                style={styles.playButtonStyle}
                              />
                            </View>
                          )}
                          <TouchableOpacity
                            onPress={() => removeImage(media.uri)}
                            className="absolute bottom-3 right-0 z-10 p-2">
                            <Icon
                              name="minus"
                              type="entypo"
                              color={Colors.Secondary}
                              size={28}
                              style={styles.closeIconholder}
                              backgroundColor={'#00000055'}
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                  </View>
                  <CustomDescription
                    value={values.caption}
                    descrTitle={'Add a Caption'}
                    placeholder={'Enter a short description'}
                    onChangeText={handleChange('caption')}
                    blurOnSubmit={true}
                  />
                  {errors.caption && (
                    <Text style={styles.errorText}>{touched.caption && errors.caption}</Text>
                  )}
                  <View style={{ margin: 6 }} />
                  {!isParent && (
                    <>
                      <View style={{ marginVertical: 10 }}>
                        <Text style={styles.text}>Tag Students</Text>
                      </View>
                      <MultiSelectDropdown
                        list={studentsList}
                        selectedIds={students}
                        showAvatar={true}
                        search={true}
                        placeholder={'Select Students'}
                        searchPlaceholder={'Search Students'}
                        setSelectedIds={setStudents}
                      />
                      <View style={{ margin: 4 }} />
                      <View style={{ marginVertical: 10 }}>
                        <Text style={styles.text}>Tag Activity</Text>
                      </View>
                      <SingleSelect
                        list={activityList}
                        save={activity}
                        onChange={(val) => setActivity(val)}
                        maxHeight={200}
                        placeholder={'Select Activity'}
                        searchPlaceholder={'Search Activity'}
                      />
                      <View style={{ margin: 8 }} />
                      <View style={{ marginVertical: 10 }}>
                        <Text style={styles.text}>Privacy Level</Text>
                      </View>
                      <PrivacyLevelDropdown
                        value={privacyLevel}
                        setPrivacyLevel={setPrivacyLevel}
                      />
                    </>
                  )}
                </View>
                <View style={{ padding: '15%' }} />
              </KeyboardAwareScrollView>
              {isUploading && <MediaProcessingLayout />}
              <CustomSubmit
                hideDelete={true}
                loader={loader}
                buttonText={'Publish Journal'}
                onPress={() => {
                  handleSubmit();
                }}
                disabled={journalMedia.length === 0}
              />
            </View>
          );
        }}
      </Formik>
      <CustomBottomSheet sheetRef={imageSheetRef} snapPoints={imageSnapPoints}>
        <ImagePickerSheet
          captureImage={() => {
            Platform.OS === 'ios' ? selectMedia('camera') : setShowAndroidCameraActions(true);
            handleCloseSheet();
          }}
          chooseFile={() => selectMedia('gallery')}
        />
      </CustomBottomSheet>
    </SwipeGestureView>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    backgroundColor: Colors.Secondary
  },
  iconsCtn: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 20,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Grey
  },
  text: textStyle(14, '500'),
  errorText: {
    fontSize: 10,
    color: Colors.Crimson
  },
  imageContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows wrapping to the next row
    justifyContent: 'space-between' // Distribute items evenly
  },
  mediaContainer: {
    position: 'relative',
    width: '48%', // Two items per row with spacing
    aspectRatio: 1, // Ensures square containers
    marginBottom: 10, // Space between rows
    borderRadius: 8, // Optional for aesthetics
    backgroundColor: Colors.LightGrey // Optional for visibility
  },
  imageCtn: {
    width: '100%',
    height: '100%',
    borderRadius: 8
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8
  },
  removeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 2,
    backgroundColor: '#00000055',
    borderRadius: 15,
    padding: 5
  },
  playButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  playButtonStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: Colors.Secondary
  },
  imageFileContainer: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.LightGrey
  },
  fileTitleCtn: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectIcon: {
    position: 'absolute',
    bottom: 20,
    right: 8,
    zIndex: 1
  },
  closeIconholder: {
    width: 28,
    height: 28,
    borderRadius: 28
  }
});

export default CreatePost;
