import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchNotifications } from '../../services/notificationService';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../constants/theme';
import { wp,hp } from '../../helpers/common';
import Screenwrapper from '../../components/Screenwrapper';
import { useRouter } from 'expo-router';
import NotificationItem from '../../components/NotificationItem';
import Header from '../../components/Header';


const Notifications = () => {

  const[notifications, setNotifications] = useState([]);
  const{user} = useAuth()
  const router = useRouter();
 


  useEffect(()=> {
     getNotifications()
    
  }, []);
   

  const getNotifications = async () => {
    let res = await fetchNotifications(user.id)
   if(res.success) setNotifications(res.data)
  }
  
  return (
   <Screenwrapper>
      <View style={styles.container}>
        <Header title="Notifications"/>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listStyle}>
             {
              notifications.map(item => {
                return (
                  <NotificationItem
                    item={item}
                    key={item.id}
                    router={router}
                  />
                )
              })
             }
             {
              notifications.length = 0 && (
                <Text style={styles.noData}> No notifications yet</Text>
              )
             }
        </ScrollView>
      </View>
   </Screenwrapper>
  )
}

export default Notifications

const styles = StyleSheet.create({
  container: {
      flex: 1,
      paddingHorizontal: wp(4),
  },
  listStyle: {
      gap: 10,
      paddingVertical: 20,
  },
  noData: {
      color: theme.colors.text,
      fontSize: hp(1.8),
      fontWeight: theme.fonts.medium,
      textAlign: 'center',
  },
});
