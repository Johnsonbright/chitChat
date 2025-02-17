import { View, Text, Button } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import Screenwrapper from '../components/Screenwrapper'

const index = () => {
 const router = useRouter()

  return (
    <Screenwrapper>
      <Text>index</Text>
      <Button title="welcome b" onPress={() => router.push('welcome')}/>
    </Screenwrapper>
  )
}

export default index