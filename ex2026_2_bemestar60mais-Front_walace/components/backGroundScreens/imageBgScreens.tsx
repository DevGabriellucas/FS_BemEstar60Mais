import { ImageBackground, Dimensions } from "react-native"

type Props = {
    bgColor : undefined,
}

export default function ImageBgScreens({ bgColor }:Props){
    const {width, height} = Dimensions.get('window');

    return(
        <ImageBackground style={{width: '100%', height: height}} source={require('@/assets/images/bg.png')}>
            <ImageBackground style={{width: '100%', height: height}} source={bgColor}>

            </ImageBackground>
        </ImageBackground>
    )
}