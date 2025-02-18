import { View, Text, Button, Image } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import Screenwrapper from '../components/Screenwrapper'
import Loading from '../components/Loading'

const index = () => {
 const router = useRouter()

  return (
    <View style={{flex:1, alignItems: 'center', justifyContent: "center"}}>
       <Loading size={150}  />
       <Image source={require("../assets/images/logo.png")} resizeMode='contain' style={{zIndex: -100, top: -142}}/>
    </View>
  )
}

export default index