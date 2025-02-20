import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'
import Loading from './Loading'

const Button = ({
  buttonStyle,
  textStyle,
  title="",
  onPress = ()=> {},
  loading = false,
  hasShadow = true
}) => {

  const shadowStyle = {
     shadowColor: theme.colors.dark,
     shadowOffset: {width: 0, height: 10},
     shadowOpacity: 0.2,
     shadowRadius:4,
     elevation:4
  }
  if (loading) {
    return (
      <View style={[styles.button, buttonStyle, {backgroundColor: "#E3E4E5"}]}>
         <Loading/>
      </View>
    )
  }
  return (
    <Pressable onPress ={onPress} style={[styles.button, buttonStyle, hasShadow && shadowStyle]}>
        <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
    
    
  )
}

export default Button

const styles = StyleSheet.create({
   button: {
    backgroundColor: theme.colors.primary,
    height: hp(6.6),
    justifyContent: "center",
    alignItems:"center",
    borderCurve: "continous",
    borderRadius: theme.radius.xl
   },
   text: {
    fontSize: hp(2.5),
    color: 'white',
    fontWeight: theme.fonts.bold
   }
})