import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { theme } from '../constants/theme'
import { hp,wp } from '../helpers/common'
import Avatar from './Avatar'
import moment from 'moment'
import Icon from '../assets/icons'
import RenderHtml from 'react-native-render-html';
import Image from '../assets/icons/Image'
import { getSupabaseFileUrl } from '../services/imageService'
import { Video } from 'expo-av'
import { createPostLike, removePostLike } from '../services/postService'

const textStyle ={
    color: theme.colors.dark,
    fontSize: hp(1.75)
}
const tagsStyles = {
 div: textStyle,
 p: textStyle,
 ol: textStyle,
 h1: {
  color: theme.colors.dark
 },
 h1: {
  color: theme.colors.dark
 }
}

const PostCard = ({
   item,
   currentUser,
   router,
   hasShadow = true
}) => {

  // Likes
  const [likes, setLikes] = useState([])
   useEffect(() => {
      setLikes(item?.postLikes)
     
   },[])
     
  

  const onLike = async() => {

    if(liked) {
      // remove like
      let updatedLikes = likes.filter(like => like.userId != currentUser?.id)
      console.log("🚀 ~ onLike ~ updatedLikes:", updatedLikes)

      setLikes([...updatedLikes])
      let res = await removePostLike(item?.id, currentUser?.id);
      console.log("🚀 ~ remove like:", res)
      if(!res.success) {
        Alert.alert("Post ", "Something went wrong")
       }

    }else {
      let data = {
        userId: currentUser?.id,
        postId: item?.id
      }
       setLikes([...likes, data])
      let res = await createPostLike(data);
      console.log("🚀 ~ added like:", res)
      if(!res.success) {
       Alert.alert("Post ", "Something went wrong")
      }
    }
 
     
  }

  const postDetails = () => {

  }

const shadowStyles = {
   shadowOffset:{
     width: 0,
     height: 2,
   },
   shadowOpacity: 0.06,
   shadowRadius:6,
   elevation:1
}

const createdAt = moment(item?.created_at).format('MM D Y');

const liked = likes.filter(like => like?.userId === currentUser?.id)[0] ? true: false;





  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
       <View style={styles.header}>
          {/* user info and post time */}
          <View style={styles.userInfo}>
              <Avatar
                 size={hp(4.5)}
                 uri={item?.user?.image}
                 rounded={theme.radius.md}
              />
              <View style={{gap:2}}>
                 <Text style={styles.username}>{item?.user?.username}</Text>
                 <Text style={styles.postTime}>{createdAt}</Text>
              </View>
          </View>

          <TouchableOpacity onPress={postDetails}>
             <Icon name="threeDotsHorizontal" size={hp(3.4)} strokeWidth={3} color={theme.colors.text}/>
          </TouchableOpacity>
       </View>
       {/* Post body and media here */}
       <View styles={styles.content}>
        <View style={styles.postBody}>
            {
            item.body && (
              <RenderHtml 
                 contentWidth={wp(100)}
                 source={{html: item?.body}}
                 tagsStyles={tagsStyles}
              />
            )
            
            }
        </View>
        {/* post image */}
        {
          item?.file && item?.file?.includes('postImages') && (
            <Image
               source={getSupabaseFileUrl(item?.file)}
               transition={100}
               style={styles.postMedia}
               contentFit="cover"
            />
          )
        }
        {/* post video */}
        {
          item?.file && item?.file.includes('postVideos') && (
            <Video
              style={[styles.postMedia, {height:hp(25)}]}
              source={getSupabaseFileUrl(item?.file)}
              useNativeControls
              resizeMode='cover'
              isLooping
            />
          )
        }
       </View>

       {/* like, comment and share */}
        <View style={styles.footer}>
          <View style={styles.footerButton}>
              <TouchableOpacity onPress={onLike}>
                  <Icon name="heart" size={23} fill={liked? theme.colors.rose : 'transparent'} color={liked ? theme.colors.rose : theme.colors.textLight}/>
              </TouchableOpacity>
              <Text style={styles.count}>
                 {
                  likes?.length
                 }
              </Text>
          </View>
          <View style={styles.footerButton}>
              <TouchableOpacity>
                  <Icon name="comment" size={23} color={theme.colors.textLight}/>
              </TouchableOpacity>
              <Text style={styles.count}>
                 {
                 0
                 }
              </Text>
          </View>
          <View style={styles.footerButton}>
              <TouchableOpacity>
                  <Icon name="share" size={23} color={theme.colors.textLight}/>
              </TouchableOpacity>
             
          </View>
        </View>
    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({
  actions: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 18,
  },
  container: {
      backgroundColor: 'white',
      borderColor: theme.colors.gray,
      borderCurve: 'continuous',
      borderRadius: theme.radius.xxl * 1.1,
      borderWidth: 0.5,
      gap: 10,
      marginBottom: 15,
      padding: 10,
      paddingVertical: 12,
      shadowColor: '#000000',
  },
  content: {
      gap: 10,
  },
  count: {
      color: theme.colors.text,
      fontSize: hp(1.8),
  },
  footer: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 15,
  },
  footerButton: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 4,
      marginLeft: 5,
  },
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  postBody: {
      marginLeft: 5,
  },
  postMedia: {
      borderCurve: 'continuous',
      borderRadius: theme.radius.xl,
      height: hp(40),
      width: '100%',
  },
  postTime: {
      color: theme.colors.textLight,
      fontSize: hp(1.4),
      fontWeight: theme.fonts.medium,
  },
  userInfo: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
  },
  username: {
      color: theme.colors.textDark,
      fontSize: hp(1.4),
      fontWeight: theme.fonts.medium,
  },
});