import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Screenwrapper from '../../components/Screenwrapper'
import Header from '../../components/Header'
import { theme } from '../../constants/theme'
import { hp,wp } from '../../helpers/common'
import Avatar from '../../components/Avatar'
import { useAuth } from '../../contexts/AuthContext'
import RichTextEditor from '../../components/RichTextEditor'

const NewPosts = () => {

  const {user} = useAuth();
  return (
    <Screenwrapper>
      <View style={styles.container}>
      <Header title="Create Post"/>
      <ScrollView contentContainerStyle={{gap:20}} > 
          {/* avatar */}
           <View style={styles.header}>
             <Avatar
                uri={user?.image}
                size={hp(6.5)}
                rounded={theme.radius.xl}
             />
             <View style={{gap:2}}>
                <Text style={styles.username}>
                   {
                    user && user.username
                   }
                </Text>
                <Text style={styles.publicText}>
                   Public
                </Text>
             </View>
           </View>
           <View style={styles.textEditor}>
              <RichTextEditor/>
           </View>
      </ScrollView>
      </View>
       
    </Screenwrapper>
  )
}

export default NewPosts

const styles = StyleSheet.create({
  addImageText: {
      color: theme.colors.text,
      fontSize: hp(1.9),
      fontWeight: theme.fonts.semibold,
  },
  avatar: {
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderCurve: 'continuous',
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      height: hp(6.5),
      width: hp(6.5),
  },
  closeIcon: {
      backgroundColor: 'rgba(255, 0, 0, 0.6)',
      borderRadius: 50,
      padding: 7,
      position: 'absolute',
      right: 10,
      top: 10,
  },
  container: {
      flex: 1,
      gap: 15,
      marginBottom: 30,
      paddingHorizontal: wp(4),
  },
  file: {
      borderCurve: 'continuous',
      borderRadius: theme.radius.xl,
      height: hp(30),
      overflow: 'hidden',
      width: '100%',
  },
  header: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 12,
  },
  imageIcon: {
      borderRadius: theme.radius.md,
  },
  media: {
      alignItems: 'center',
      borderColor: theme.colors.gray,
      borderCurve: 'continuous',
      borderRadius: theme.radius.xl,
      borderWidth: 1.5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 12,
      paddingHorizontal: 18,
  },
  mediaIcons: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 15,
  },
  publicText: {
      color: theme.colors.textLight,
      fontSize: hp(1.7),
      fontWeight: theme.fonts.medium,
  },
  textEditor: {},
  title: {
      color: theme.colors.text,
      fontSize: hp(2.5),
      fontWeight: theme.fonts.semibold,
      textAlign: 'center',
  },
  username: {
      color: theme.colors.text,
      fontSize: hp(2.2),
      fontWeight: theme.fonts.semibold,
  },
  video: {},
});