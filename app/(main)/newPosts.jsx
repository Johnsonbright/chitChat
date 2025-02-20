import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import Screenwrapper from '../../components/Screenwrapper'
import Header from '../../components/Header'
import { theme } from '../../constants/theme'
import { hp,wp } from '../../helpers/common'
import Avatar from '../../components/Avatar'
import { useAuth } from '../../contexts/AuthContext'
import RichTextEditor from '../../components/RichTextEditor'
import { useRouter } from 'expo-router'
import Icon from '../../assets/icons'
import Button from "../../components/Button"
import * as ImagePicker from 'expo-image-picker';
import Image from '../../assets/icons/Image'
import { getSupabaseFileUrl } from '../../services/imageService'
import { Video } from 'expo-av'
import { createOrUpdatePost } from '../../services/postService'

const NewPosts = () => {


  const {user} = useAuth();
  const bodyRef = useRef('');
  const editorRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null)

  const onPick = async (isImage) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: isImage
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });


      if (!result.canceled) {
        setFile(result.assets[0]); // Update state with selected file
      }
    } catch (error) {
      console.error('Error picking media:', error);
    }
  };

  const isLocalFile = file => {
    if(!file) return null;
    if(typeof file == 'object') return true
  }  

  const getFileType = (file) => {
    if(file) return null;
    if(isLocalFile(file)) {
      return file.type;
    }

    // check image or video for remote file
    if(file.includes('postImage')){
        return 'image'
    }
    return 'video'
  }

  const getFileUri = file => {
    if(!file) return null;
    if(isLocalFile){
        return file.uri
    }

    return getSupabaseFileUrl(file)?.uri
  }

const onSubmit = async() => {
    console.log('body', bodyRef.current)
    console.log("file", file)

    if(!bodyRef.current && !file) {
        Alert.alert("Post", "please choose an image or add post ");
        return;
    }

    let data = {
        file,
        body:bodyRef.current,
        userId: user?.id
    }

    // create post
    setLoading(true);
    let res = await createOrUpdatePost(data)
    setLoading(false)
    console.log("Post Response", res)

    if (res.success){
        setFile(null);
        bodyRef.current = "";
        editorRef.current?.setContentHTML("")
        router.back()
    }else{
        Alert.alert("Post", res.msg);

    }
}
console.log("File Uri", getFileUri(file))
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
           <RichTextEditor ref={editorRef} onChange={(body) => (bodyRef.current = body)} />
           </View>
            {
                file && (
                    <View style={styles.file}>
                       {
                        getFileType(file) == 'video' ? (
                          <Video
                            style={{flex:1}}
                            source={{
                                uri: getFileUri(file)
                            }}
                            useNativeControls
                            resizeMode='cover'
                            isLooping
                          />

                        ): (
                          <Image source={{uri: getFileUri(file)}} resizeMode="cover"/>
                        )
                       }
                       <Pressable style={styles.closeIcon} onPress={() => setFile(null)} >
                       <Icon name="delete" size={22} color="white"/>
                       </Pressable>
                     
                    </View>
                )
            }

           <View style={styles.media} >
               <Text style={styles.addImageText}>Add Post</Text>
               <View style={styles.mediaIcons}>
                 <TouchableOpacity onPress={() => onPick(true)}>
                    <Icon name="image" size={30} color={theme.colors.dark}  />
                 </TouchableOpacity>
                 <TouchableOpacity onPress={() => onPick(false)}>
                    <Icon name="video" size={30} color={theme.colors.dark}  />
                 </TouchableOpacity>
               
               </View>
           </View>
      </ScrollView>
       <Button 
          buttonStyle={{height:hp(6.2)}}
          title="Post"
          loading={loading}
          hasShadow={false}
          onPress={onSubmit}
       />
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
  textEditor: {
    minHeight: 285
  },
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