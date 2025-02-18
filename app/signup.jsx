import {  Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState, useRef } from 'react'
import Screenwrapper from '../components/Screenwrapper'
import { theme } from '../constants/theme'
import Icon from '../assets/icons'
import { StatusBar } from 'expo-status-bar'
import BackButton from '../components/BackButton'
import { useRouter } from 'expo-router'
import { hp,wp } from '../helpers/common'
import Input from '../components/Input'
import Button from '../components/Button'
import { supabase } from '../lib/supabase'

const signup = () => {
  const router = useRouter()
  const usernameRef = useRef("")
  const emailRef = useRef("")
  const passwordRef = useRef("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async () => {
    if(!emailRef.current || !passwordRef.current ) {
      Alert.alert("Sign Up", "Please register")
      return;
    }

    let username = usernameRef.current.trim();
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true)
    const {data: {session}, error} = await supabase.auth.signUp({
      email,
      password, 
      options:{
        data: {
          username
        }
      }
    })
     setLoading(false)
   
    if(error) {
      Alert.alert("Sign Up", error.message)
    }
  }

  return (
    <Screenwrapper bg ="white">
       <StatusBar  style="dark"/>
        <View style={styles.container}>
           <BackButton router={router}/>

           {/* welcome */}
           <View>
             <Text style={styles.welcomeText}>Welcome,</Text>
             <Text style={styles.welcomeText}>Let's Get Started</Text>
           </View>

           {/* form */}
           <View style={styles.form}>
             <Text style={{fontSize: hp(2.0), color: theme.colors.text}}>
                Sign Up here
             </Text>
               <Input icon ={<Icon name="user" size={26} strokeWidth={1.6}/>}
                placeholder = "Username"
                onChangeText={value => usernameRef.current = value.charAt(0).toUpperCase() + value.slice(1)}
               />
               <Input icon ={<Icon name="mail" size={26} strokeWidth={1.6}/>}
                placeholder = "Email Address"
                onChangeText={value => emailRef.current = value}
               />
               <Input icon ={<Icon name="lock" size={26} strokeWidth={1.6}/>}
                placeholder = "Password"
                onChangeText={value => passwordRef.current = value}
                secureTextEntry
               />
                {/* button */}
                 <Button title="Sign Up" loading={loading} onPress={onSubmit}/>
          
                {/* footer */}
                  <View style={styles.footer}>
                      <Text style = {styles.footerText}> Already have an account?</Text>
                      <Pressable onPress={() => router.push("login")}>
                         <Text style={[styles.footerText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}> Login Here</Text>
                      </Pressable>
                  </View>
           </View>
        </View>
    </Screenwrapper>
  )
}

export default signup

const styles = StyleSheet.create({
  container: {
      flex: 1,
      gap: 45,
      paddingHorizontal: wp(5),
  },
  forgotPassword: {
      color: theme.colors.text,
      fontWeight: theme.fonts.semibold,
      textAlign: 'right',
  },
  form: {
      gap: 25,
  },
  footer: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 5,
      justifyContent: 'center',
  },
  footerText: {
      color: theme.colors.text,
      textAlign: 'center',
      fontSize: hp(1.6),
  },
  welcomeText: {
      color: theme.colors.text,
      fontSize: hp(4),
      fontWeight: theme.fonts.bold,
  },
});
