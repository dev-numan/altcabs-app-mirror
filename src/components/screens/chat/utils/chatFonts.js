import {Platform} from 'react-native'
const fonts ={
Black : Platform.OS == "ios" ? "Poppins-Black" : "Poppins-Black",
BlackItalic : Platform.OS == "ios" ? "Poppins-BlackItalic" : "Poppins-BlackItalic",
Bold : Platform.OS == "ios" ? "Poppins-Bold" : "Poppins-Bold",
BoldItalic : Platform.OS == "ios" ? "Poppins-BoldItalic" : "Poppins-BoldItalic",
ExtraBold : Platform.OS == "ios" ? "Poppins-ExtraBold" : "Poppins-ExtraBold",
ExtraBoldItalic : Platform.OS == "ios" ? "Poppins-ExtraBoldItalic" : "Poppins-ExtraBoldItalic",
ExtraLight : Platform.OS == "ios" ? "Poppins-ExtraLight" : "Poppins-ExtraLight",
ExtraLightItalic : Platform.OS == "ios" ? "Poppins-ExtraLightItalic" : "Poppins-ExtraLightItalic",
Italic : Platform.OS == "ios" ? "Poppins-Italic" : "Poppins-Italic",
Light : Platform.OS == "ios" ? "Poppins-Light" : "Poppins-Light",
LightItalic : Platform.OS == "ios" ? "Poppins-LightItalic" : "Poppins-LightItalic",
Medium : Platform.OS == "ios" ? "Poppins-Medium" : "Poppins-Medium",
MediumItalic : Platform.OS == "ios" ? "Poppins-MediumItalic" : "Poppins-MediumItalic",
Regular : Platform.OS == "ios" ? "Poppins-Regular" : "Poppins-Regular",
SemiBold : Platform.OS == "ios" ? "Poppins-SemiBold" : "Poppins-SemiBold",
SemiBoldItalic : Platform.OS == "ios" ? "Poppins-SemiBoldItalic" : "Poppins-SemiBoldItalic",
Thin : Platform.OS == "ios" ? "Poppins-Thin" : "Poppins-Thin",
ThinItalic : Platform.OS == "ios" ? "Poppins-ThinItalic" : "Poppins-ThinItalic",

}

export default fonts