import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Screenwrapper from '../components/Screenwrapper'
import { StatusBar } from 'expo-status-bar'
import { wp,hp } from '../helpers/common'
import { theme } from '../constants/theme'
import Button from '../components/Button'
import { useRouter } from 'expo-router'

const welcome = () => {
  const router = useRouter();
  return (
    <Screenwrapper bg="white">
      <StatusBar style="dark"/>
       <View style={styles.container}> 
        {/* welcome image */}
        <Image style={styles.welcomeImage} resizeMode='contain' source={require("../assets/images/welcome.png")}/>
        {/* title */}
         <View style={{gap:15}}>
          <Text style={styles.title}>ChitChat 🤖 </Text>
          <Text style={styles.punchline}>Connect. Share. Vibe.!</Text>
         </View>
         {/* footer */}
         <View style={styles.footer}> 
            <Button
             title="Explore ChitChat"
             buttonStyle={{marginHorizontal: wp(3)}}
             onPress={() => router.push("signup")}
            />  
            <View style={styles.bottomTextContainer}>
               <Text style={styles.loginText}>
                  Already have an account!
               </Text>
                <Pressable onPress={() => router.push("login")}>
                   <Text style={[styles.loginText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}> Log In</Text>
                </Pressable>
            </View>
         </View>
       </View>
    </Screenwrapper>
  )
}

export default welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center", 
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingHorizontal: wp(4)
  },
  welcomeImage: {
   height: hp(40), 
   width: wp(100)
  },
  title:{
   color: theme.colors.text,
   fontSize: hp(4),
   textAlign: "center",
   fontWeight: theme.fonts.extraBold
  },
  punchline: {
    textAlign: "center",
    paddingHorizontal: wp(10),
    fontSize: hp(1.7),
    color: theme.colors.text
  },
  footer: {
    gap: 30,
    width: '100%'
  }, 
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
    gap: 5,
  },
  loginText: {
     textAlign: "center",
     color: theme.colors.text,
     fontSize: hp(1.6)
  }
})