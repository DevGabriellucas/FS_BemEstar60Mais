import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'dkso@938453!Baldso789@33aATcopsnqu!269nsd';

export function UserInfoServices(){

    function encriptar(dados:string){

        const stringEncriptada = CryptoJS.AES.encrypt(dados, SECRET_KEY).toString();
        //console.log("String encriptada:", stringEncriptada);

        return stringEncriptada
    }

    function decriptar(dadosEncriptados:string){
        const bytesDecriptados = CryptoJS.AES.decrypt(dadosEncriptados, SECRET_KEY);
        const stringDecriptada = bytesDecriptados.toString(CryptoJS.enc.Utf8);
        //console.log("String decriptada:", stringDecriptada);

        return stringDecriptada
    }

    async function getUserInfo(){

        let data = String(await AsyncStorage.getItem('userInfo'));
        data = decriptar(data)

        try{
            const userInfo = JSON.parse(data)
            return userInfo

        }catch(error){
            //console.error(error)
        }

        return null
    }

    async function storeUserInfoData(userInfo:string){
        try{

            let info = encriptar(userInfo)
            //console.log('informacao criptografada')
            //console.log(info)

            await AsyncStorage.setItem('userInfo', info);
        
        }catch(error){
            console.error(error)
        }
        
    }

    async function storeFirstAccessData(userInfo:string){
        try{

            let info = encriptar(userInfo)

            await AsyncStorage.setItem('userFirstAccess', info);
        
        }catch(error){
            console.error(error)
        }
        
    }

    async function getFirstAccessData(){

        let data = String(await AsyncStorage.getItem('userFirstAccess'));
        data = decriptar(data)

        try{
            const userInfo = JSON.parse(data)
            return userInfo

        }catch(error){
            console.error(error)
        }

        return null
    }
    
    return{ getUserInfo, storeUserInfoData, storeFirstAccessData, getFirstAccessData }

}