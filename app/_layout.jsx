import { View, Text,LogBox } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { getUserData } from '../services/userService'

LogBox.ignoreLogs(['Warning: TNodeChildrenRenderer', 'Warning: MemoizedTNodeRenderer:', 'Warning: TRenderEngineProvider:'])

const _layout = () =>{
  return (
     <AuthProvider>
       <MainLayout/>
     </AuthProvider>
  )
}

const MainLayout = () => {
  const router = useRouter()
 const {setAuth, setUserData} = useAuth()

 useEffect(() => {
     
  supabase.auth.onAuthStateChange((_event, session) => {
   

    if(session){
      setAuth(session?.user)
      updateUserData(session?.user, session?.user?.email)
      router.replace("/home")
    }else{
      setAuth(null)
      router.replace("/welcome")
    }
  })
 }, [])
  const updateUserData = async (user, email) => {
     let res = await getUserData(user?.id)
    if(res.success){
      setUserData({...res.data, email}) 
      // Make sure to fix the trigger on supabase trigger function to include an email.
    }
  
  }

  return (
     <Stack
       screenOptions={{
        headerShown: false
       }}
     />
  )
}

export default _layout