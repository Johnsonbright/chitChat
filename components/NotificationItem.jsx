import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp,wp } from '../helpers/common'
import Avatar from './Avatar'

const NotificationItem = ({
  item,
  router
}) => {

  const handleClick = () => {

  }
  // console.log('Item😜😜 ', item)
  return (
     <TouchableOpacity style={styles.container} onPress={handleClick}>
       <Avatar
         uri={item?.sender?.image}
         size={hp(5)}
       />
     </TouchableOpacity>
  )
}

export default NotificationItem

const styles = StyleSheet.create({
  container: {
      alignItems: 'center',
      backgroundColor: 'white',
      borderColor: theme.colors.darkLight,
      borderCurve: 'continuous',
      borderRadius: theme.radius.xxl,
      borderWidth: 0.5,
      flex: 1,
      flexDirection: 'row',
      gap: 12,
      justifyContent: 'center',
      padding: 15,
  },
  nameTitle: {
      flex: 1,
      gap: 2,
  },
  text: {
      color: theme.colors.text,
      fontSize: hp(1.6),
      fontWeight: theme.fonts.medium,
  },
});