import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Screenwrapper from '../../components/Screenwrapper'
import Button from '../../components/Button'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'





const Home = () => {

const {user, setAuth} = useAuth();
console.log("🚀 ~ Home ~ user:", user)

  const onLogout = async() => {
 
    const {error} = await supabase.auth.signOut()
    if(error) {
      Alert.alert("Sign Out", error.message)
    }
  }
  return (
     <Screenwrapper>
       <Text>Home</Text>
       <Button title ="Log out" onPress={onLogout}/>
     </Screenwrapper>
     
   
  )
}

export default Home

const styles = StyleSheet.create({})