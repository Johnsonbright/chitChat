import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { forwardRef, useRef } from 'react';
import { RichToolbar, RichEditor, actions } from 'react-native-pell-rich-editor';
import { theme } from '../constants/theme';

const RichTextEditor = forwardRef(({ onChange }, ref) => {
  const scrollRef = useRef();

  return (
    <ScrollView ref={scrollRef} style={{ flex: 1 }}>
      <View style={{ minHeight: 285 }}>
        {/* Toolbar for rich text actions */}
        <RichToolbar
          actions={[
            actions.alignCenter,
            actions.alignLeft,
            actions.alignRight,
            actions.blockquote,
            actions.code,
            actions.heading1,
            actions.heading4,
            actions.insertOrderedList,
            actions.line,
            actions.removeFormat,
            actions.setBold,
            actions.setItalic,
            actions.setStrikethrough,
          ]}
          iconMap={{
            [actions.heading1]: ({ tintColor }) => <Text style={{ color: tintColor }}>H1</Text>,
            [actions.heading4]: ({ tintColor }) => <Text style={{ color: tintColor }}>H4</Text>,
          }}
          style={styles.richBar}
          flatContainerStyle={styles.listStyle}
          selectedIconTint={theme.colors.primaryDark}
          editor={ref} // Correct way to pass ref to the toolbar
          disabled={false}
        />

        {/* Rich Text Editor */}
        <RichEditor
          ref={ref} // Correctly passing ref
          useContainer={true}
          containerStyle={styles.rich}
          editorStyle={styles.contentStyle}
          placeholder="Write a post"
          onChange={(body) => {
            console.log("Editor content:", body);
            if (onChange) {
              onChange(body);
            }
          }}
          onCursorPosition={(scrollY) => {
            scrollRef.current?.scrollTo({ y: scrollY - 30, animated: true });
          }}
        />
      </View>
    </ScrollView>
  );
});

export default RichTextEditor;

const styles = StyleSheet.create({
  listStyle: {},
  rich: {
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    borderColor: theme.colors.gray,
    borderTopWidth: 0,
    borderWidth: 1.5,
    flex: 1,
    minHeight: 240,
    padding: 5,
  },
  richBar: {
    backgroundColor: theme.colors.gray,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
  },
});


// import { StyleSheet, Text, View, ScrollView } from 'react-native'
// import React from 'react'
// import { RichToolbar,RichEditor, actions } from 'react-native-pell-rich-editor'
// import { theme } from '../constants/theme'
// import { useRef } from 'react'

// const RichTextEditor = ({
//   editorRef,
//   onChange
// }) => {

//   const scrollRef = useRef()
//   return (
//     <ScrollView ref={scrollRef} style={{ flex: 1 }}>
//     <View style={{ minHeight: 285 }}>
//       <RichToolbar
//         actions={[
//           actions.alignCenter,
//           actions.alignLeft,
//           actions.alignRight,
//           actions.blockquote,
//           actions.code,
//           actions.heading1,
//           actions.heading4,
//           actions.insertOrderedList,
//           actions.line,
//           actions.removeFormat,
//           actions.setBold,
//           actions.setItalic,
//           actions.setStrikethrough,
//         ]}
//         iconMap={{
//           [actions.heading1]: ({ tintColor }) => <Text style={{ color: tintColor }}>H1</Text>,
//           [actions.heading4]: ({ tintColor }) => <Text style={{ color: tintColor }}>H4</Text>,
//         }}
//         style={styles.richBar}
//         flatContainerStyle={styles.listStyle}
//         selectedIconTint={theme.colors.primaryDark}
//         editor={editorRef}
//         disabled={false}
//       />

//       <RichEditor
//         ref={editorRef}
//         useContainer={true} // Ensure correct rendering
//         containerStyle={styles.rich}
//         editorStyle={styles.contentStyle}
//         placeholder="Write a post"
//         onChange={(body) => {
//           console.log("Editor content type:", typeof body); // Should be 'string'
//           console.log("Editor content value:", body);
//           if (onChange) {
//             onChange(body);
//           }
//         }}
//         onCursorPosition={(scrollY) => {
//           scrollRef.current?.scrollTo({ y: scrollY - 30, animated: true });
//         }}
//       />
//     </View>
//   </ScrollView>
// //     <View style={{minHeight:285}}>
// //       <RichToolbar
// //         actions={[
// //           actions.alignCenter,
// //           actions.alignLeft,
// //           actions.alignRight,                            actions.blockquote,
// //           actions.code,
// //           actions.heading1,
// //           actions.heading4,                              actions.insertOrderedList,
// //           actions.line,
// //           actions.removeFormat,
// //           actions.setBold,
// //           actions.setItalic,
// //           actions.setStrikethrough,
// //         ]}
// //         iconMap={{
// //            [actions.heading1] : ({tintColor}) => <Text style={{color: tintColor}}>H1</Text>,
// //            [actions.heading4] : ({tintColor}) => <Text style={{color: tintColor}}>H4</Text>
// //         }}

// //         style={styles.richBar}
// //         flatContainerStyle={styles.listStyle}
// //         selectedIconTint={theme.colors.primaryDark}
// //         editor={editorRef}
// //         disabled={false}
// //       />
 
// // <RichEditor
// //   ref={editorRef}
// //   containerStyle={styles.rich}
// //   editorStyle={styles.contentStyle}
// //   placeholder="Write a post"
// //   onChange={(body) => {
// //     console.log("Editor content type:", typeof body); // Should be 'string'
// //     console.log("Editor content value:", body);
// //     onChange(body); // Ensure this properly updates state
// //   }}
// // />
// // {/* <RichEditor
// //         ref={editorRef}
// //         containerStyle={styles.rich}
// //         editorStyle={styles.contentStyle}
// //         placeholder="Write a post"
// //         onChange={onChange} // Ensure `onChange` is properly passed
// //       /> */}
// //     </View>
//   )
// }

// export default RichTextEditor

// const styles = StyleSheet.create({
//   containerStyle: {},
//   flatStyle: {
//       gap: 3,
//       paddingHorizontal: 8,
//   },
//   listStyle: {},
//   rich: {
//       borderBottomLeftRadius: theme.radius.xl,
//       borderBottomRightRadius: theme.radius.xl,
//       borderColor: theme.colors.gray,
//       borderTopWidth: 0,
//       borderWidth: 1.5,
//       flex: 1,
//       minHeight: 240,
//       padding: 5,
//   },
//   richBar: {
//       backgroundColor: theme.colors.gray,
//       borderTopLeftRadius: theme.radius.xl,
//       borderTopRightRadius: theme.radius.xl,
//   },
// });