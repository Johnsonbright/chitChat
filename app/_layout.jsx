import { View, Text,LogBox } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { getUserData } from '../services/userService'
import PushNotification from '../components/PushNotification'

LogBox.ignoreLogs(['Warning: TNodeChildrenRenderer', 'Warning: MemoizedTNodeRenderer:', 'Warning: TRenderEngineProvider:'])

const _layout = () =>{
  return (
     <AuthProvider>
       <PushNotification/>
       <MainLayout/>
     </AuthProvider>
  )
}

const MainLayout = () => {
  const router = useRouter()
 const {setAuth, setUserData} = useAuth()

//  Potential improvement to prevent memory leak✅
//  useEffect(() => {
     
//   supabase.auth.onAuthStateChange((_event, session) => {
   

//     if(session){
//       setAuth(session?.user)
//       updateUserData(session?.user, session?.user?.email)
//       router.replace("/home")
//     }else{
//       setAuth(null)
//       router.replace("/welcome")
//     }
//   })
//  }, [])

useEffect(() => {
  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      setAuth(session?.user);
      updateUserData(session?.user, session?.user?.email);
      router.replace("/home");
    } else {
      setAuth(null);
      router.replace("/welcome");
    }
  });

  return () => {
    authListener?.subscription?.unsubscribe(); // Cleanup
  };
}, []);



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
     >
      <Stack.Screen
        name="(main)/postDetails"
        options={{ 
          presentation: 'modal', // 👈 This makes it a modal
          headerShown: false,
          animation: "slide_from_bottom" // 👈 Optional for better effect
        }} 
      />
     </Stack>
  )
}

export default _layout