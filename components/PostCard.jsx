import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp,wp } from '../helpers/common'
import Avatar from './Avatar'
import moment from 'moment'
import Icon from '../assets/icons'
import RenderHtml from 'react-native-render-html';

const PostCard = ({
   item,
   currentUser,
   router,
   hasShadow = true
}) => {
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

const createdAt = moment(item?.created_at).format('MM D Y')
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
              />
            )
            
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