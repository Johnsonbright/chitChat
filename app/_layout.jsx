import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const _layout = () =>{
  return (
     <AuthProvider>
       <MainLayout/>
     </AuthProvider>
  )
}

const MainLayout = () => {
  const router = useRouter()
 const {setAuth} = useAuth()

 useEffect(() => {
     
  supabase.auth.onAuthStateChange((_event, session) => {
    console.log("🚀 ~ supabase.auth.onAuthStateChange ~ session:", session?.user.id)

    if(session){
      setAuth(session?.user)
      router.replace("/home")
    }else{
      setAuth(null)
      router.replace("/welcome")
    }
  })
 }, [])

  return (
     <Stack
       screenOptions={{
        headerShown: false
       }}
     />
  )
}

export default _layout