import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdatePost = async (post) => {
  try{
    // upload image
    if(post.file && typeof post.file == 'object') {
      let isImage = post?.file.type == 'image';
      let folderName = isImage? 'postImages': 'postVideos';
      let fileResult = await uploadFile(folderName, post?.file.uri, isImage)

      if(fileResult.success) post.file = fileResult.data;
      else{
        return fileResult;
      }
    }

    const {data, error} = await supabase.from("posts")
    .upsert(post)
    .select()
    .single();

    if(error) {
      console.log("createPost error", error);
      return{
        success:false, msg: "could not create post"
      }
    }

    return {  success:true, data: data}
  }catch(error){
    console.log("createPost error", error);
    return{
      success:false, msg: "could not create post"
    }
  }
}


// Fetch Post 
export const fetchPosts = async (limit=10) => {
  try{
  const {data, error} = await supabase
  .from('posts')
  .select(`
    *,
     user: users(id, username, image),
     postLikes (*),
     comments (count)
    `)
  .order('created_at', {ascending: false})
  .limit(limit);

  if (error){
    console.log("FetchPosts error", error);
    return {success: false, msg: 'Could not fetch the posts'}
  }
 return { success:true, data:data}

  }catch(error){
    console.log("FetchPosts error", error);
    return {success: false, msg: 'Could not fetch the posts'}
  }
}

// Post like
export const createPostLike  = async (postLike) => {
  try{
  const {data, error} = await supabase
  .from('postLikes')
  .insert(postLike)
  .select()
  .single()


  if (error){
    console.log("postLike error", error);
    return {success: false, msg: 'Could not like post'}
  }
 return { success:true, data:data}

  }catch(error){
    console.log("postLike error", error);
    return {success: false, msg: 'Could not like post'}
  }
}
// remove like
export const removePostLike  = async (postId, userId) => {
  try{
  const { error} = await supabase
  .from('postLikes')
  .delete()
  .eq('userId', userId)
  .eq('postId', postId)


  if (error){
    console.log("removeLike error", error.message);
    return {success: false, msg: 'Could not remove liked post'}
  }
 return { success:true}

  }catch(error){
    console.log("postLike error", error);
    return {success: false, msg: 'Could not remove liked post'}
  }
}

// Fetch Post Deatils 
export const fetchPostDetails = async (postId) => {
  try{
  const {data, error} = await supabase
  .from('posts')
  .select(`
    *,
     user: users(id, username, image),
     postLikes (*),
     comments (*, user: users(id, username, image))
    `)
  .eq('id', postId)
  .order('created_at', {ascending: false, foreignTable: 'comments'})
  .single();

  if (error){
    console.log("FetchPostDetails error", error);
    return {success: false, msg: 'Could not fetch the posts details'}
  }
 return { success:true, data:data}

  }catch(error){
    console.log("FetchPostDetails error", error);
    return {success: false, msg: 'Could not fetch the post details'}
  }
}

// Create Comment
export const createComment  = async (comment) => {
  try{
  const {data, error} = await supabase
  .from('comments')
  .insert(comment)
  .select()
  .single()


  if (error){
    console.log("comment error", error);
    return {success: false, msg: 'Could not like comment'}
  }
 return { success:true, data:data}

  }catch(error){
    console.log("comment error", error);
    return {success: false, msg: 'Could not like comment'}
  }
}

// remove comment
export const removeComment  = async (commentId) => {
  try{
  const { error} = await supabase
  .from('comments')
  .delete()
  .eq('id', commentId)


  if (error){
    console.log("remove comment error", error.message);
    return {success: false, msg: 'Could not remove comment'}
  }
 return { success:true, data: {commentId}}

  }catch(error){
    console.log("remove comment error", error.message);
    return {success: false, msg: 'Could not remove comment'}
  }
}
