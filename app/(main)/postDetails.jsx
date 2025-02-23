import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { createComment, fetchPostDetails, removeComment, removePost } from '../../services/postService';
import { hp,wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import PostCard from '../../components/PostCard';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Loading';
import Input from "../../components/Input";
import Icon from '../../assets/icons';
import CommentItem from '../../components/CommentItem';
import moment from 'moment';
import { getUserData } from '../../services/userService';
import { supabase } from '../../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNotification } from '../../services/notificationService';

const postDetails = () => {

  const router = useRouter();
  
  const {postId, commentId} = useLocalSearchParams();
 
  const {user} = useAuth()
 

  const [post, setPost] = useState(null);
  // console.log("🚀 ~ postDetails ~ post:", post)
  const[startLoading, setStartLoading] = useState(true);
  const [loading, setLoading] = useState(false)
  const inputRef= useRef(null)
  const commentRef = useRef('')

// ✅ comment section
  // const handleNewComment = async(payload) => {
  //   console.log("get new comment", payload.new)

  //   if(payload.new) {
  //     let newComment = {...payload.new};
  //     let res = await getUserData(newComment.userId);
  //     newComment.user = res.success? res.data: {};
  //     setPost(prevPost => {
  //       return {
  //         ...prevPost,
  //         comments: [newComment, ...prevPost.comments]
  //       }
  //     })
  //   }
  // }

  // useEffect(() => {

  //   getPostDetails()

  //     let commentChannel = supabase
  //     .channel('comments')
  //     .on('postgres_changes',
  //        {event: "INSERT",
  //          schema: 'public', 
  //          table:'comments',
  //          filter: `postId=eq.${postId}`
  //        }, handleNewComment)
  //     .subscribe();


  //      return () => {
  //       supabase.removeChannel(commentChannel)
  //      }
  //   },[])

  const handleNewComment = async (payload) => {
    console.log("get new comment", payload.new);
  
    if (payload.new) {
      let newComment = { ...payload.new };
      let res = await getUserData(newComment.userId);
      newComment.user = res.success ? res.data : {};
  
      setPost((prevPost) => {
        return {
          ...prevPost,
          comments: prevPost?.comments ? [newComment, ...prevPost.comments] : [newComment],
        };
      });
    }
  };
  
  useEffect(() => {
    getPostDetails();
  
    const commentChannel = supabase
      .channel('comments')
      .on(
        'postgres_changes',
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        (payload) => handleNewComment(payload) 
      )
      .subscribe();
  
    return () => {
      supabase.channel('comments').unsubscribe(); // ✅ Proper cleanup
    };
  }, [postId]); // ✅ Depend on postId to prevent stale state
  

  const getPostDetails = async() => {
    // fetch post details here
    let res = await fetchPostDetails(postId)
  
  if(res.success) {
    setPost(res.data)
  }
  setStartLoading(false)
  }

  // comments
  const onNewComment = async () => {
       if(!commentRef.current) return null;
       let data = {
        userId: user?.id,
        postId: post?.id,
        text: commentRef.current
       }

      //  create comments
       setLoading(true);
       let res = await createComment(data);
      
       setLoading(false)
       if(res.success) {
        // send notification to user
        if(user.id != post.userId){
          //send notification
          let notify ={
            senderId: user.id,
            receiverId: post.userId,
            title: 'commented on your post',
            data: JSON.stringify({postId: post.id, commentId: res?.data?.id})
          }
          createNotification(notify);
        }
          
         inputRef?.current?.clear();
         commentRef.current ="";
       }else{
        Alert.alert('Comment', res.msg)
       }
  }

  // Delete comment
  const onDelete = async (comment) => {
    console.log('deleting comment', comment);
    let res = await removeComment(comment?.id)
    if(res.success) {
       setPost(prevPost => {
        let updatePost = {...prevPost};
        updatePost.comments = updatePost.comments.filter(c => c.id !== comment.id);
        return updatePost;
       })
    }else{
      Alert.alert('Comment', res.msg)
    }
  }

  // loading state
  if (startLoading){
    return (
      <View style={styles.center}>
         <Loading/>
      </View>
    )
  }
  if (!post) {
    return (
      <View style={styles.center}>
        <Text>No post found</Text>
      </View>
    );
  }

  // Delete and Edit Post

  const onDeletePost = async(item) => {
// delete post here
let res = await removePost(post.id);
if(res.success) {
  router.back();
}else{
  Alert.alert("Post", res.msg);
}

  
  }

 const onEditPost = async(item) => {
  router.back()
 router.push({pathname: 'newPosts', params: {...item}})

 }
  
  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          <PostCard
             item={{...post, comments: [{count: post.comments?.length}]}}
             currentUser={user}
             router={router}
             hasShadow={false}
             showMoreIcon={false}
             showDelete={true}
             onDelete={onDeletePost}
             onEdit={onEditPost}
          />

          {/* comments input*/}
          <View style={styles.inputContainer}>
             <Input
                placeholder="Type comment..."
                placeholderTextColor={theme.colors.textLight}
                containerStyle={{flex:1, height: hp(6.2), borderRadius: theme.radius.xl}}
                inputRef={inputRef}
                onChangeText={value => commentRef.current = value}

             />
             {
              loading? (
                <View style={styles.loading}>
                  <Loading/>
                </View>
              ):
              (
                <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
                <Icon name="send" color={theme.colors.primaryDark}/>
              </TouchableOpacity>
              )
             }
           
            
          </View>
            {/* comment list */}
            <View style={{marginVertical: 15, gap: 17}}>
               {
                post?.comments?.map(comment => {
                  return <CommentItem
                    	key={comment?.id.toString()}
                     	item={comment}
                     	cancelDelete = {user.id == comment.userId || user.id == post.userId}
                     	highlight={comment.id == commentId}
                     	onDelete={onDelete}
                  	/>
                    
                })
                
               }
               {
                post?.comments?.length ==0 && (
                  <Text color={{color: theme.colors.text, marginLeft: 5}}>
                      Be the first to comment!
                  </Text>
                )
               }
            </View>
      </ScrollView>
     
    </SafeAreaView >
  )
}

export default postDetails

const styles = StyleSheet.create({
  center: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
  },
  container: {
      backgroundColor: 'white',
      flex: 1,
      paddingVertical: wp(7),
  },
  inputContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 10,
  },
  list: {
      paddingHorizontal: wp(4),
  },
  loading: {
      alignItems: 'center',
      height: hp(5.8),
      justifyContent: 'center',
      transform: [{ scale: 1.3 }],
      width: hp(5.8),
  },
  notFound: {
      color: theme.colors.text,
      fontSize: hp(2.5),
      fontWeight: theme.fonts.medium,
  },
  sendIcon: {
      alignItems: 'center',
      borderColor: theme.colors.primary,
      borderCurve: 'continuous',
      borderRadius: theme.radius.lg,
      borderWidth: 0.8,
      height: hp(5.8),
      justifyContent: 'center',
      width: hp(5.8),
  },
});