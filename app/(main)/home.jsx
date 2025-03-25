import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React,{useEffect, useState} from 'react'
import Screenwrapper from '../../components/Screenwrapper'
import Button from '../../components/Button'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { theme } from '../../constants/theme'
import { hp,wp } from '../../helpers/common'
import Icon from "../../assets/icons"
import { useRouter } from 'expo-router'
import Avatar from '../../components/Avatar'
import { fetchPosts } from '../../services/postService'
import PostCard from '../../components/PostCard'
import Loading from '../../components/Loading'
import { getUserData } from '../../services/userService'
import { StatusBar } from 'expo-status-bar'
import { updateLanguageServiceSourceFile } from 'typescript'


var limit = 0

const Home = () => {
const router = useRouter()
const {user, setAuth} = useAuth();
console.log("🚀 ~ Home ~ user:", user)
const [posts,setPosts] = useState([])
const [hasMore, setHasMore] = useState(true)
const [notificationCount, setNotificationCount] = useState(0)

const handlePostEvent = async (payload) => {
  console.log("🚀 ~ handlePostEvent ~ payload:", payload)
  if(payload.eventType == 'INSERT' && payload?.new?.id){
    let newPost ={...payload.new};
    let res = await getUserData(newPost?.userId)
    newPost.postLikes = [];
    newPost.comments = [{count: 0}]
    newPost.user = res.success? res.data: {}
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }
  if(payload.eventType =="DELETE" && payload.old.id){
    setPosts(prevPosts => {
      let updatedPosts = prevPosts.filter(post => post.id != payload.old.id);
      return updatedPosts;

    })
  }
    if(payload.eventType == 'UPDATE' && payload?.new?.id){
     setPosts(prevPosts => {
      let updatedPosts = prevPosts.map(post => {
        if(post.id == payload.new.id) {
           post.body = payload.new.body;
           post.file = payload.new.file;
        }
        return post;
      });
      return updatedPosts
     })
 
    }
  
}

const handleNewNotification = (payload) => {
  console.log("🚀 ~ handleNewNotification ~ payload:", payload)
  if (payload.eventType === 'INSERT' && payload?.new?.id) {
      setNotificationCount((prev) => prev + 1);
  }
};


// useEffect(() => {
// getPost()
// console.log('user.id', user?.id)
//   let postChannel = supabase.channel('posts')
//   .on('postgres_changes', {event: '*', schema: 'public', table:'posts'}, handlePostEvent)
//   .subscribe();


//   let notificationChannel = supabase
//   .channel('notifications')
//   .on(
//       'postgres_changes',
//       { event: 'INSERT', filter: `receiverId=eq.${user?.id}`, schema: 'public', table: 'notifications' },
//       handleNewNotification,
//   )
//   .subscribe();
  
//    return () => {
//     supabase.removeChannel(postChannel)
//     supabase.removeChannel(notificationChannel)
//    }
// },[])

useEffect(() => {
  getPost();

  let postChannel = supabase.channel('posts')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, handlePostEvent)
    .subscribe();

  let notificationChannel = supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `receiverId=eq.'${user?.id}'` },
      handleNewNotification
    )
    .subscribe();

  return () => {
    supabase.removeChannel(postChannel);
    supabase.removeChannel(notificationChannel);
  };
}, [user?.id]); // Ensure effect runs when user.id is available


const getPost = async() => {
//  call api post
if(!hasMore) return null;
limit = limit + 6
let res = await fetchPosts(limit)
if(res.success){
  if(posts.length == res.data.length) setHasMore(false)
    setPosts(res.data)
}
}
  return (
     <Screenwrapper bg="#E3E4E5">
      <StatusBar backgroundColor="gray"/>
       <View style={styles.container} >
           {/* header */}
            <View style={styles.header}>
               <Text style={styles.title}>ChitChat 💬</Text>
               <View style={styles.icons}>
                  <Pressable onPress={() => {
                    setNotificationCount(0)
                    router.push("notifications")}}>
                     <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
                     {
                      notificationCount > 0 && (
                        <View style={styles.pill}>
                          <Text style={styles.pillText}>{notificationCount}</Text>
                        </View>
                      )
                     }
                  </Pressable>
                  <Pressable onPress={() => router.push("newPosts")}>
                     <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
                  </Pressable>
                  <Pressable  onPress={() => router.push("profile")}>
                     <Avatar
                      uri= {user?.image}
                      size={hp(4.3)}
                      rounded={theme.radius.sm}
                      style={{borderWidth:2}}
                     />
                  </Pressable>
               </View>
            </View>

            {/* posts */}

              <FlatList
                 data ={posts}
                 showsVerticalScrollIndicator={false}
                 contentContainerStyle={styles.listStyle}
                 keyExtractor={item => item.id.toString()}
                 renderItem={({item}) =>  <PostCard
                   item ={item}
                   currentUser={user}
                   router={router}
                 />
                }
                onEndReached={() =>{
                  getPost()
                  console.log("End of the post reached")
                }}
                onEndReachedThreshold={0}
                ListFooterComponent={hasMore? (
                    <View style={{marginVertical:posts.length == 0 ? 200: 30}}>
                        <Loading/>
                    </View>)
                    :
                    (
                      <View style={{marginVertical:30}}>
                         <Text style={styles.noPosts}>No more posts</Text>
                      </View>
                    )
                }
              />
       </View>
        

     </Screenwrapper>
     
   
  )
}

export default Home

const styles = StyleSheet.create({
  avatarImage: {
      borderColor: theme.colors.gray,
      borderCurve: 'continuous',
      borderRadius: theme.radius.sm,
      borderWidth: 3,
      height: hp(4.3),
      width: hp(4.3),
  },
  container: {
      flex: 1,
  },
  header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      marginHorizontal: wp(4),
  },
  icons: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'center',
  },
  listStyle: {
      paddingTop: 20,
      paddingHorizontal: wp(4),
  },
  noPosts: {
      color: theme.colors.text,
      fontSize: hp(2),
      textAlign: 'center',
  },
  pill: {
      alignItems: 'center',
      backgroundColor: theme.colors.roseLight,
      borderRadius: 20,
      height: hp(2.2),
      justifyContent: 'center',
      position: 'absolute',
      right: -10,
      top: -4,
      width: hp(2.2),
  },
  pillText: {
      color: 'white',
      fontSize: hp(1.2),
      fontWeight: theme.fonts.bold,
  },
  title: {
    color: 'rgba(0, 5, 102, 1)', 
    textShadowColor: 'rgba(192, 192, 192, 1)', 
    textShadowOffset: { width: -2, height: 0 }, 
    textShadowRadius: 5, 
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
  },
});