import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal
} from 'react-native';
import { GlobalStyles, textStyle } from '../../../constants/GlobalStyles';
import JournalCard from '../../../components/journal/JournalCard';
import CustomBottomSheet from '../../../components/layout/CustomBottomSheet';
import { getPrimaryUserDetails } from '../../../utilities/user.utils';
import { Colors } from '../../../constants/Colors';
import CommentInput from '../../../components/journal/CommentInput';
import CustomAddButton from '../../../components/layout/CustomAddButton';
import { Icon } from '@rneui/themed';
import {
  deleteJournal,
  fetchJournalComments,
  fetchJournalLikes,
  fetchJournalPostCount,
  fetchJournals,
  fetchStudentTaggedPosts,
  updateJournal
} from '../../../apis/Journal';
import FilterCard from '../../../components/journal/FilterCard';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import NoDataComponent from '../../../components/layout/NoDataComponent';
import { useIsFocused } from '@react-navigation/native';
import {
  deleteSelectedComment,
  parseCommentDetails,
  mergePosts,
  modifySelectedComment
} from '../../../utilities/Journal';
import { AuthContext, mixpanel } from '../../../context/AuthContext';
import CommentView from '../../../components/inputs/CommentView';
import moment from 'moment';
import CardImgLoader from '../../../components/loader/CardImgLoader';
import JournalSvg from '../../../assets/Home_Icons/Journal.svg';
import * as Sentry from '@sentry/react-native';
import { useDispatch } from 'react-redux';
import { showToast } from '../../../redux/reducers/toast';
import { DeleteAlertPopup } from '../../../utilities/arrayUtils';
import Header from '../../../components/headers/Header';
import EditCommentModal from '../../../components/modals/EditCommentModal';
import UserList from '../../../components/layout/UserList';
import SwipeGestureView from '../../../components/custom/gesture/SwipeGestureView';
import { setCanDelete, setJournalId } from '../../../redux/reducers/Journal';

const JournalList = ({ navigation, route }) => {
  const [commentSheet, setCommentSheet] = useState(false);
  const [journals, setJournals] = useState({});
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [filter, setFilter] = useState('all');
  const journalId = useRef();
  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState('');
  const [selectedComment, setSelectedComment] = useState();
  const [loader, setLoader] = useState(false);
  const [totalComments, setTotalComments] = useState({});
  const [likeList, setLikeList] = useState([]);
  const pageNumber = useRef(0);
  const [pageLoading, setPageLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [studentJournalCount, setStudentJournalCount] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(true); // Added to manage pagination
  const likeSheetRef = useRef(null);
  const commentsSheetRef = useRef(null);
  const commentsSnapPoints = [Platform.OS === 'ios' ? '92%' : '98%'];
  const filterSheetRef = useRef(null);
  const filterSnapPoints = [Platform.OS === 'ios' ? '92%' : '98%'];
  const { isParent, classId } = useContext(AuthContext);
  const { profilePicture, name, userId, isAdmin } = getPrimaryUserDetails(
    isParent ? 'parent' : 'teacher'
  );
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const isUserAuthorOfComment = selectedComment?.userId === userId;



  useEffect(() => {
    if (!route.params?.nofetch) {
      getJournalsList();
      getStudentJournalsCount();
    }
    mixpanel.track('Page - Journal');
  }, [isFocused]);

  useEffect(() => {
    setJournalsList(journals?.posts);
  }, [filter]);

  const setJournalsList = (posts) => {
    // Checking if the posts are not empty and to update the state when filter is all or untagged
    if ((!posts || !posts.length) && (filter !== 'all' || filter !== 'untagged')) return;

    let updatedPosts = [];
    if (filter === 'all') {
      updatedPosts = [...posts];
    } else if (filter === 'untagged') {
      updatedPosts = posts.filter((post) => post.tagged_students?.length === 0);
    }
    // Ensuring no duplicate posts in the filtered list
    setFilteredJournals(() => {
      const allPosts = [...updatedPosts];
      const uniquePosts = allPosts.reduce((acc, current) => {
        if (!acc.find((item) => item._id.$oid === current._id.$oid)) {
          acc.push(current);
        }
        return acc;
      }, []);
      return uniquePosts;
    });
  };

  const navToCreatePost = () => {
    navigation.navigate('CreatePost', {
      classId: classId
    });
  };

  const handleOpenSheet = async () => {
    dispatch(setCanDelete(false));
    await commentsSheetRef.current?.snapToIndex(0);
    setCommentSheet(true);
  };

  const handleCloseSheet = async () => {
    dispatch(setCanDelete(true));
    Keyboard.dismiss();
    setCommentSheet(false);
    await commentsSheetRef.current?.close();
  };

  const handleFilterSheetOpen = async () => {
    dispatch(setCanDelete(false));
    await filterSheetRef.current?.snapToIndex(0);
  };

  const handleFilterSheetClose = async () => {
    dispatch(setCanDelete(true));
    await filterSheetRef.current?.close();
  };

  const getJournalsList = async () => {
    if (!classId) return;

    setLoader(true);
    try {
      const response = await fetchJournals(classId, 1); // Default page number will be 1
      if (response.result?.posts?.length > 0) {
        pageNumber.current = 1;
        updatingCommentsCount(response.result.posts);
        setJournals(response.result);
        setJournalsList(response.result.posts);
        setLoader(false);
      } else {
        setLoader(false);
      }
    } catch (err) {
      setLoader(false);
      Sentry.captureException(err);
    }
  };

  const getStudentJournalsCount = async () => {
    if (!classId) return;

    setLoader(true);
    try {
      const response = await fetchJournalPostCount(classId);
      if (response.result) {
        setStudentJournalCount(response.result);
      }
      setLoader(false);
    } catch (err) {
      setLoader(false);
      Sentry.captureException(err);
    }
  };

  const chosenFilter = async (type) => {
    setFilter(type);
    handleFilterSheetClose();
    // Checking whether the type is not equal to all or untagged to fetch the filtered student posts
    if (type !== 'all' && type !== 'untagged') {
      try {
        setLoader(true);
        const response = await fetchStudentTaggedPosts(classId, { student_id: type }, 1); // passing page number as 1 for the initial tagged posts
        if (response.result) {
          pageNumber.current = 1; // After successful response updating the page number as 1
          updatingCommentsCount(response.result);
          setFilteredJournals(response.result);
        }
        setLoader(false);
      } catch (err) {
        setLoader(false);
        Sentry.captureException(err);
      }
    }
  };

  // To delete a journal
  const handleDeleteJournal = async () => {
    if (journalId?.current) {
      try {
        deleteJournal(journalId?.current);
        const list = filteredJournals?.filter((item) => item._id.$oid != journalId?.current);
        const journalList = journals?.posts?.filter((item) => item._id.$oid == journalId?.current);
        setFilteredJournals(list);
        setJournals(journalList);
      } catch (error) {
        Sentry.captureException(error);
        dispatch(showToast({ text: 'Failed! Please try again', type: 'error' }));
      }
    }
  };

  // To like a journal
  const handleJournalLikes = async (item) => {
    const userLiked = !item.user_liked;
    item.user_liked = userLiked;
    item.liked_count = item.liked_count ?? 0;
    item.liked_count += userLiked ? 1 : -1;
    const journalId = item._id.$oid;
    const values = { post_liked: userLiked };
    updateJournal({ journalId, values });
    setFilteredJournals([...filteredJournals]);
  };

  // To fetch comments for a journal
  const handleJournalComments = async (item) => {
    journalId.current = item._id.$oid;
    const userComments = await fetchJournalComments(item._id.$oid);
    handleOpenSheet();
    if (userComments.result) {
      setComments(userComments.result);
    }
  };

  // To show the list of users who liked the journal
  const showLikeList = async (item) => {
    await fetchJournalLikes(item?._id?.$oid)
      .then((response) => {
        setLikeList(response.map((item) => item?.user));
        likeSheetRef.current?.snapToIndex(0);
      })
      .catch((error) => {
        Sentry.captureException(error);
      });
  };

  // To send user comments
  const sendComment = async (id) => {
    if (!id) return;

    try {
      const data = {
        user: {
          _id: { $oid: userId },
          first_name: name,
          staff_profile_picture: profilePicture
        },
        comment: userComment,
        comment_time: moment().fromNow()
      };

      // To store comments count locally when a comment is added
      const count = totalComments[id] + 1;
      setTotalComments({ ...totalComments, ...(totalComments[id] = count) });
      await updateJournal({ journalId: id, values: { comment: userComment } }).then((response) => {
        if (response?.id) data._id = { $oid: response.id };

        setComments([data, ...comments]);
        setUserComment('');
      });
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const onPressOptions = (item) => {
    journalId.current = item._id.$oid;
    dispatch(setJournalId(item._id.$oid));
  };

  // Updating total comments count for each post
  const updatingCommentsCount = (posts) => {
    // Making sure the posts is an array before performing any action to prevent type errors
    if (!Array.isArray(posts)) return;
    const newTotalComments = posts.reduce(
      (acc, post) => ({
        ...acc,
        [post._id.$oid]: post.post_comments.length
      }),
      {}
    );

    setTotalComments((prevComments) => ({ ...prevComments, ...newTotalComments }));
  };

  const pageNationForJournalList = useCallback(async () => {
    if (pageLoading || !hasMoreData || !classId) return;

    setPageLoading(true);

    try {
      pageNumber.current += 1;
      if (filter !== 'all' && filter !== 'untagged') {
        const response = await fetchStudentTaggedPosts(
          classId,
          { student_id: filter },
          pageNumber.current
        );
        if (response.result?.length > 0) {
          updatingCommentsCount(response.result);
          setFilteredJournals((prev) => mergePosts(prev, response.result));
          setPageLoading(false);
        } else {
          setHasMoreData(false);
        }
      } else {
        const response = await fetchJournals(classId, pageNumber.current);
        if (response.result?.posts?.length > 0) {
          updatingCommentsCount(response.result.posts);

          setJournals((prevJournals) => {
            const allJournalPosts = mergePosts(prevJournals.posts, response.result.posts);
            setJournalsList(allJournalPosts);
            return {
              ...prevJournals,
              'Total Posts': prevJournals['Total Posts'] + response.result['Total Posts'],
              Untagged: prevJournals['Untagged'] + response.result['Untagged'],
              posts: allJournalPosts
            };
          });
          setPageLoading(false);
        } else {
          setHasMoreData(false);
        }
      }
    } catch (error) {
      setPageLoading(false);
      Sentry.captureException(error);
    } finally {
      setPageLoading(false);
    }
  }, [hasMoreData, filter, pageLoading, journals, filteredJournals]);

  // To refresh journals
  const onRefresh = async () => {
    pageNumber.current = 0;
    setRefresh(true);
    await getJournalsList();
    await getStudentJournalsCount();
    await chosenFilter(filter);
    setRefresh(false);
    setHasMoreData(true);
  };

  return (
    <SwipeGestureView navigation={navigation} targetScreen={'Dashboard'}>
      <Header onPress={() => navigation.navigate('Dashboard')} title={'🗂️ Journal'}>
        {isParent || (
          <TouchableOpacity className="p-3" onPress={handleFilterSheetOpen}>
            <Icon name="filter" type="feather" size={24} />
          </TouchableOpacity>
        )}
      </Header>
      <View style={{ margin: 4 }} />
      {loader ? (
        <CardImgLoader />
      ) : (
        <View>
          <FlatList
            data={filteredJournals}
            keyExtractor={(item) => item._id.$oid}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <View style={styles.loaderPosition}>
                {pageLoading && <ActivityIndicator size={'small'} color={Colors.Primary} />}
              </View>
            }
            ListEmptyComponent={
              <View style={{ marginTop: '40%' }}>
                <NoDataComponent
                  info={
                    isParent ? 'No journals are added to display' : `Click on + to create a Journal`
                  }>
                  <JournalSvg width={300} height={200} />
                </NoDataComponent>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={onRefresh}
                title="Pull to refresh"
                tintColor={Colors.PrimaryM}
                titleColor={Colors.Grey}
                colors={[Colors.PrimaryM]}
              />
            }
            initialNumToRender={10}
            windowSize={11} // it considers the max screens to load on top & below of the current screen, as 3 on above & 3 on below the current screen
            maxToRenderPerBatch={10} // the max items to render on each scroll at end
            onEndReachedThreshold={2} // to initiate the scroll, when last item is 2 view port visible
            updateCellsBatchingPeriod={40}
            onEndReached={pageNationForJournalList}
            renderItem={({ item }) => {
              return (
                <JournalCard
                  onPressComment={() => handleJournalComments(item)}
                  post={item}
                  onPressOptions={() => onPressOptions(item)}
                  journalId={item._id.$oid}
                  totalComments={totalComments}
                  onPressDelete={() => DeleteAlertPopup(handleDeleteJournal)}
                  onPressLike={() => handleJournalLikes(item)}
                  showLikes={() => showLikeList(item)}
                />
              );
            }}
          />
        </View>
      )}

      {!loader && <CustomAddButton onPress={navToCreatePost} />}

      {/* LIKES SHEET */}
      <CustomBottomSheet sheetRef={likeSheetRef} snapPoints={['50%', '80%']}>
        <UserList headerTitle="Likes" userList={likeList} />
      </CustomBottomSheet>

      {/* COMMENT SHEET */}
      <CustomBottomSheet
        sheetRef={commentsSheetRef}
        snapPoints={commentsSnapPoints}
        onCloseSheet={() => Keyboard.dismiss()}>
        <View style={styles.sheetContainer}>
          <View className="flex-1 px-2">
            {/* Header */}
            <View style={GlobalStyles.alignBtwContainer}>
              <Text style={textStyle(16, '600')} className="p-4">
                Comments
              </Text>

              <TouchableOpacity onPress={handleCloseSheet} className="p-4">
                <Icon name="close-circle-outline" type="material-community" size={24} />
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="mx-4 h-px bg-light_grey" />

            {/* Comments */}
            <BottomSheetFlatList
              data={comments}
              keyExtractor={(item) => item?._id?.$oid}
              ListEmptyComponent={
                <View style={{ alignItems: 'center', marginTop: '25%' }}>
                  <Text style={textStyle(16, '500')}>No comments yet</Text>
                </View>
              }
              renderItem={({ item }) => {
                const comment = parseCommentDetails(item);
                return (
                  <CommentView
                    uploadedImage={comment.profilePicture}
                    userName={comment.userName}
                    comment={comment.comment}
                    time={comment.comment_time}
                    isSelected={
                      selectedComment ? selectedComment.commentId === comment.commentId : false
                    }
                    setSelected={(selected) => (selected ? setSelectedComment(comment) : null)}
                    canUserDeleteComment={isAdmin || (comment.userId === userId)}
                    commentUserId={comment.userId}
                    userId={userId}
                  />
                )
              }}
            />
          </View>

          {/* New Comment Box */}
          {commentSheet && (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
              <CommentInput
                uploadedImage={profilePicture}
                value={userComment}
                onChangeText={(text) => setUserComment(text)}
                onSend={() => sendComment(journalId?.current)}
              />
            </KeyboardAvoidingView>
          )}
        </View>
      </CustomBottomSheet>

      {/* COMMENT MODAL */}
      {
        <Modal
          visible={selectedComment !== undefined}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedComment(undefined)}>
          <EditCommentModal
            selectedComment={selectedComment}
            setSelectedComment={setSelectedComment}
            isUserAuthorOfComment={isUserAuthorOfComment}
            modifySelectedComment={() =>
              modifySelectedComment(selectedComment, setSelectedComment, setComments, dispatch)
            }
            deleteSelectedComment={() =>
              deleteSelectedComment(selectedComment, setSelectedComment, setComments, dispatch)
            }
          />
        </Modal>
      }

      {/* FILTER SHEET */}
      <CustomBottomSheet
        removeBackDropOpacity={true}
        sheetRef={filterSheetRef}
        snapPoints={filterSnapPoints}
        background={true}>
        <View className="flex-1 bg-white p-2">
          {/* Header */}
          <View style={GlobalStyles.alignBtwContainer}>
            <Text style={textStyle(20, '600')} className="px-4">
              Filter
            </Text>
            <TouchableOpacity onPress={handleFilterSheetClose} className="p-4">
              <Icon
                name="close-circle-outline"
                type="material-community"
                color={Colors.Primary}
                size={24}
              />
            </TouchableOpacity>
          </View>

          {/* Filters */}
          <BottomSheetFlatList
            data={studentJournalCount?.student_data}
            keyExtractor={(item) => item.student_id.$oid}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View>
                <FilterCard
                  onPress={() => chosenFilter('all')}
                  icon={'users'}
                  title={'All Journals'}
                  count={studentJournalCount?.total_posts}
                />
                <FilterCard
                  onPress={() => chosenFilter('untagged')}
                  icon={'tag'}
                  title={'Untagged'}
                  count={studentJournalCount?.untagged}
                />
              </View>
            }
            ListFooterComponent={<View style={{ margin: 16 }} />}
            renderItem={({ item }) => {
              return (
                <FilterCard
                  onPress={() => chosenFilter(item.student_id.$oid)}
                  image={item.student_profile_picture}
                  title={item.student_name}
                  count={item.count_tagged}
                />
              );
            }}
          />
        </View>
      </CustomBottomSheet>
    </SwipeGestureView>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    backgroundColor: Colors.Secondary
  },
  loaderPosition: {
    alignItems: 'center',
    marginBottom: '30%'
  }
});

export default JournalList;
