import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Screenwrapper from '../../components/Screenwrapper'
import { hp,wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Header from '../../components/Header'
import Input from '../../components/Input'
import { Image } from 'expo-image'
import { useAuth } from '../../contexts/AuthContext'
import { getuserImageSrc, uploadFile } from '../../services/imageService'
import Icon from '../../assets/icons'
import Button from "../../components/Button"
import { supabase } from '../../lib/supabase'
import { updateUserData } from '../../services/userService'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';

const editProfile = () => {
  const router = useRouter();
  const {user: currentUser, setUserData} = useAuth();
  const [loading, setLoading] = useState(false)

  const fetchCurrentUser = async() => {
    if (currentUser){
      setUser({
        username: currentUser.username || "",
        phoneNumber: currentUser.phoneNumber || "",
        image: currentUser.image || "",
        address: currentUser.address || "",
        bio: currentUser.bio || ""
      })
    }
  }
  const [user, setUser] = useState({
    username: "",
    phoneNumber: "",
    image: null,
    bio: "",
    address:""
  })

  useEffect(() => {
     fetchCurrentUser()
  }, [currentUser])

  const onPickImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:  ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setUserData({...user, image:result.assets[0].uri });
    }
  }

  const onSubmit = async () => {
   let userData = {...user}
   let {username, phoneNumber, address, image, bio} = userData;
   if (!username || !phoneNumber || !address || !bio || !image){
     Alert.alert('Profile', "Please fill all the field");
     return;
   }
   setLoading(true)
  if(typeof image == 'object') {
    // upload image
    let imageRes = await uploadFile('profiles', image?.uri, true)
  
    if(imageRes.success) {
      userData.image = imageRes.data || "";
    }else userData.image = null;
  }

  //  update user
  const res = await updateUserData(currentUser?.id, userData);


  console.log("🚀 ~ onSubmit ~ res:", res)
  setLoading(false)
  if(res.success){
    setUserData({...currentUser, ...userData})
    router.back();
 }
  } 
   

  let imageSource = user?.image && typeof user?.image == "object" ? user.image.uri : getuserImageSrc(user?.image)
  return (
   <Screenwrapper>
       <View style={styles.container}>
          <ScrollView style={{flex:1}}>
              <Header title="Edit Profile"/>

              {/* form  */}
               <View style={styles.form}>
                  <View style={styles.avatarContainer}>
                    <Image
                     source={imageSource}
                     style={styles.avatar}
                    />
                    <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                       <Icon name="camera" size={20} strokeWidth={2.5} />
                    </Pressable>
                  </View>
                   <Text style={{fontSize: hp(1.5),  color: theme.colors.text}}>
                      Please fill your profile details
                   </Text>
                    {/* input */}
                      <Input 
                        icon ={<Icon name="user"/>}
                        placeholder="Enter your username"
                        value={user.username}
                        onChangeText={value =>setUser({...user, username: value})}
                      />
                      <Input 
                        icon ={<Icon name="call"/>}
                        placeholder="Enter your phone number"
                        value={user.phoneNumber}
                        onChangeText={value =>setUser({...user, phoneNumber: value})}
                      />
                      <Input 
                        icon ={<Icon name="location"/>}
                        placeholder="Enter your address"
                        value={user.address}
                        onChangeText={value =>setUser({...user, address: value})}
                      />
                      <Input 
                        placeholder="About me"
                        value={user.bio}
                        multiline={true}
                        containerStyle={styles.bio}
                        onChangeText={value =>setUser({...user, bio: value})}
                      />

                       <Button title="Update" loading={loading} onPress={onSubmit}/>
               </View>
          </ScrollView>
       </View>
   </Screenwrapper>
  )
}

export default editProfile

const styles = StyleSheet.create({
  avatar: {
      borderColor: theme.colors.darkLight,
      borderCurve: 'continuous',
      borderRadius: theme.radius.xxl * 1.8,
      borderWidth: 1,
      height: '100%',
      width: '100%',
  },
  avatarContainer: {
      alignSelf: 'center',
      height: hp(14),
      width: hp(14),
  },
  bio: {
      alignItems: 'flex-start',
      flexDirection: 'row',
      height: hp(15),
      paddingVertical: 15,
  },
  cameraIcon: {
      backgroundColor: 'white',
      borderRadius: 50,
      bottom: 0,
      elevation: 7,
      padding: 8,
      position: 'absolute',
      right: -10,
      shadowOffset: { height: 4, width: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 5,
  },
  container: {
      flex: 1,
      paddingHorizontal: wp(4),
  },
  form: {
      gap: 18,
      marginTop: 20,
  },
  input: {
      flexDirection: 'row',
      borderColor: theme.colors.text,
      borderCurve: 'continuous',
      borderRadius: theme.radius.xxl,
      borderWidth: 0.4,
      gap: 15,
      padding: 17,
      paddingHorizontal: 20,
  },
});
