import * as FileSystem from 'expo-file-system';
import { supabase } from '../lib/supabase';
import { decode } from 'base64-arraybuffer';

export const getuserImageSrc = (imagePath) => {
  if(imagePath) {
    return {uri: imagePath}
  }else{
    return require('../assets/images/defaultprofile.png')
  }
}

export const uploadFile = async(folderName, fileuri, isImage=true) => {
   try{
     let fileName = getFilePath(folderName, isImage)
     const fileBase64 = await FileSystem.readAsStringAsync(fileuri, {
      encoding: FileSystem.EncodingType.Base64
     });
     let imageData = decode(fileBase64) // to array buffer
     let {data, error} = await supabase
     .storage
     .from('uploads')
     .upload(fileName, imageData, {
      cacheControl: '3600',
      upsert: false,
      contentType: isImage? 'image/*' : 'video/*'
     });
     if(error){
      console.log("File upload errors from supabase", error);
      return {success: false, msg:error.message}
     }

     console.log('data', data)
      return { success: true, data: data.path}
   }catch(error) {
    console.log("File upload errors", error);
    return {success: false, msg:error.message}
   }
}

export const getFilePath = (folderName, isImage) => {
   return `/${folderName}/${(new Date()).getTime()}${isImage? '.png': '.mp4'}`
}