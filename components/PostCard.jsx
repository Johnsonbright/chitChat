import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { theme } from '../constants/theme'
import { hp,stripHtmlTags,wp } from '../helpers/common'
import Avatar from './Avatar'
import moment from 'moment'
import Icon from '../assets/icons'
import RenderHtml from 'react-native-render-html';
import Image from '../assets/icons/Image'
import { downloadFile, getSupabaseFileUrl } from '../services/imageService'
import { Video } from 'expo-av'
import { createPostLike, removePostLike } from '../services/postService'
import Loading from './Loading'

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
   hasShadow = true,
   showMoreIcon = true,
   showDelete =false,
   onDelete = () => {},
   onEdit = () => {}
}) => {

  // Likes
  const [likes, setLikes] = useState([])
  const [loading, setLoading] = useState(false)
   useEffect(() => {
      setLikes(item?.postLikes || [])
     
    
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

  // share
  const onShare = async() => {
      let content = {message: stripHtmlTags(item?.body) };
      if(item?.file) {
        // download the file then share the local uri
        setLoading(true)
        let url = await downloadFile(getSupabaseFileUrl(item?.file).uri)
        setLoading(false)
        console.log("🚀 ~ onShare ~  url:",  url)
        content.url = url
      
      }
      Share.share(content);
   

  }

  const postDetails = () => {

    if(!showMoreIcon) return null
     router.push({pathname: 'postDetails', params: {postId: item?.id}})
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

const handlePostDelete = () => {
  Alert.alert('Confirm', "Are you sure you want to delete",[
    {
      text: 'Cancel',
      onPress: () => console.log('modal cancelled'),
      style: "cancel"
    },
    {
      text: "Delete",
      onPress: () => onDelete(item),
      style: 'destructive'
    },
  ],
  {cancelable: true}
)
}

const createdAt = moment(item?.created_at)?.format('MM D Y');

// const liked = likes.filter(like => like?.userId === currentUser?.id)[0] ? true: false;

const liked = (likes || []).filter(like => like?.userId === currentUser?.id)[0] ? true : false;




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
           {
            showMoreIcon && (
              <TouchableOpacity onPress={postDetails}>
              <Icon name="threeDotsHorizontal" size={hp(3.4)} strokeWidth={3} color={theme.colors.text}/>
           </TouchableOpacity>
            )
           }
           {
             showDelete && currentUser.id == item?.userId && (
              <View style={styles.actions}>
              <TouchableOpacity onPress={() => onEdit(item)}>
                 <Icon name = "edit" size={hp(2.5)} strokeWidth={3} color={theme.colors.text}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePostDelete}>
                 <Icon name = "delete" size={hp(2.5)} strokeWidth={3} color={theme.colors.text}/>
              </TouchableOpacity>
           </View>
             )
           }
         
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
              <TouchableOpacity onPress={postDetails}>
                  <Icon name="comment" size={23} color={theme.colors.textLight}/>
              </TouchableOpacity>
              <Text style={styles.count}>
                 {
                 item.comments[0]?.count
                 }
              </Text>
          </View>
          <View style={styles.footerButton}>
            {
               loading ? (
                <Loading size="small"/>
               ):
               <TouchableOpacity onPress={onShare}>
                  <Icon name="share" size={23} color={theme.colors.textLight}/>
              </TouchableOpacity>
            }
              
             
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
      marginBottom: 10,
      padding:10
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