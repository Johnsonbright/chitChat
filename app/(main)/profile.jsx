import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Screenwrapper from '../../components/Screenwrapper'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'expo-router'
import Header from '../../components/Header'
import { hp, wp } from '../../helpers/common'
import Icon from '../../assets/icons'
import { theme } from '../../constants/theme'
import { supabase } from '../../lib/supabase'
import Avatar from '../../components/Avatar'

const Profile = () => {

  const {user, setAuth} = useAuth();
  const router = useRouter();

  const onLogout = async() => {
 
    const {error} = await supabase.auth.signOut()
    if(error) {
      Alert.alert("Sign Out", error.message)
    }
  }

  const handleSignout = async() => {
    //  show confirm signout modal
    Alert.alert("Confirm", "Are you sure you want to log out ?", [
      {
        text: "Cancel",
        onPress: () => console.log("Modal Cancelled"),
        style:"cancel"
      },
      {
        text: "Logout",
        onPress: () => onLogout(),
        style: 'destructive'
      }
    ],
    {cancelable:true}
  )

  }
  return (
    <Screenwrapper bg="#E3E4E5">
      <UserHeader user={user} router ={router} handleSignout={handleSignout}/>
    </Screenwrapper>
  )
}

const UserHeader = ({user, router, handleSignout}) => {
  return (
    <View style={{flex:1, paddingHorizontal: wp(4)}}> 
      <View>
         <Header title="Profile" mb={30}/>
         <TouchableOpacity style={styles.logoutButton} onPress={handleSignout}>
            <Icon name="logout" color={theme.colors.rose}/>
         </TouchableOpacity>
      </View>

      <View style={styles.container}>
         <View style={{gap:15}}>
          <View style={styles.avatarContainer}>
          <Avatar
               uri ={user?.image}
               size={hp(12)}
               rounded={theme.radius.xxl*1.4}
            />
            <Pressable style={styles.editIcon} onPress={() => router.push('editProfile')}>
               <Icon name="edit" strokeWidth={2.5} size={30} />
            </Pressable>
          </View>
            {/* username and address */}
           <View style={{alignItems: 'center', gap:4}}>
              <Text style={styles.userName}>
                {user?.username.charAt(0).toUpperCase() + user?.username.slice(1)}
              </Text>
              <Text style={styles.infoText}>
                {user?.address || "Null"}
              </Text>
           </View>

           {/* email, phone,bio */}
           <View style={{gap: 10}}>
               <View style={styles.info}>
                  <Icon name ="mail" size={20} color={theme.colors.textLight} />
                  <Text style={styles.infoText}> {user && user?.email}</Text>
               </View>
               {user && user?.phoneNumber && (
                 <View style={styles.info}>
                 <Icon name ="call" size={20} color={theme.colors.textLight} />
                 <Text style={styles.infoText}>user && user?.phoneNumber </Text>
              </View>
               ) 
               }
               {
                  user && user?.bio && (
                    <View style={styles.info}>
                  <Icon name ="user" size={20} color={theme.colors.textLight} />
                  <Text style={styles.infoText}> {user && user?.email}</Text>
               </View>
                  )
               }
               
           </View>

         </View>

      </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  avatarContainer: {
      alignSelf: 'center',
      height: hp(12),
      width: hp(12),
  },
  container: {
      flex: 1,
  },
  editIcon: {
      backgroundColor: '#FFFEF2',
      borderRadius: 50,
      bottom: 0,
      elevation: 7,
      padding: 7,
      position: 'absolute',
      right: -12,
      shadowColor: theme.colors.textLight,
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 5,
  },
  headerContainer: {
      marginHorizontal: wp(4),
      marginBottom: 20,
  },
  headerShape: {
      height: hp(20),
      width: wp(100),
  },
  info: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 10,
  },
  infoText: {
      color: theme.colors.textLight,
      fontSize: hp(1.6),
      fontWeight: '500',
  },
  listStyle: {
      paddingHorizontal: wp(4),
      paddingBottom: 30,
  },
  logoutButton: {
      backgroundColor: '#FEE2E2',
      borderRadius: theme.radius.lg,
      padding: 5,
      position: 'absolute',
      right: 0,
  },
  noPosts: {
      color: theme.colors.text,
      fontSize: hp(2),
      textAlign: 'center',
  },
  userName: {
      color: theme.colors.textDark,
      fontSize: hp(3),
      fontWeight: '500',
  },
});
