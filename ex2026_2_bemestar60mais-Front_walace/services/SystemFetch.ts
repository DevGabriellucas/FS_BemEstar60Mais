export const SystemFetch = () => {

    async function enviarDados(url: string, dados: any, token: string) {
        
        //define o header padrao sem autenticacao, e se o token tiver um valor utiliza o bearer
        var customHeader = { 'Content-Type': 'application/json', 'User-Agent': 'insomnia/10.3.1', 'Authorization' : '' }

        if(token != ''){
            customHeader.Authorization = `Bearer ${token}`
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: customHeader,
                body: JSON.stringify(dados),
            });

            if (response.ok) {
                const responseData = await response.json();
                return responseData;

            }else{
                throw new Error(`Erro: ${response.status}`);
                
            }
            

        } catch (error) {
            //console.error('Erro ao fazer o fetch:', error);
            throw error;
        }
    }

    return { enviarDados };
}