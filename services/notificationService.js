import { supabase } from "../lib/supabase";

export const createNotification  = async (notification) => {
  try{
  const {data, error} = await supabase
  .from('notifications')
  .insert(notification)
  .select()
  .single()


  if (error){
    console.log("notification error", error);
    return {success: false, msg: 'Something went wrong'}
  }
 return { success:true, data:data}

  }catch(error){
    console.log("notification error", error);
    return {success: false, msg: 'Something went wrong'}
  }
}



export const fetchNotifications = async (receiverId) => {
  try{
  const {data, error} = await supabase
  .from('notifications')
  .select(`
    *,
     sender: senderId(id, username, image)
    `)
  .eq('receiverId', receiverId)
  .order('created_at', {ascending: false})
  ;

  if (error){
    console.log("Could not fetch notification error", error);
    return {success: false, msg: 'Could not fetch notification error'}
  }
 return { success:true, data:data}

  }catch(error){
    console.log("Could not fetch notification error", error);
    return {success: false, msg: 'Could not fetch notification error'}
  }
}