// This class contains methods to send out requests to the backend server.

class Request{
    static baseURL = null;

    static buildRequestURL(path, options={}){
        let finalPath = `${this.baseURL}${path}`;
        let keys = Object.keys(options);
        if(finalPath.substring(finalPath.length-1, finalPath.length) !== '/'){
            finalPath += '/';
        }

        for(let i=0; i < keys.length; i++){
            if(i===0){
                finalPath += '?';
            }
            if(i < keys.length - 1){
                finalPath += `${keys[i]}=${options[keys[i]]}&`;
            }else{
                finalPath += `${keys[i]}=${options[keys[i]]}`;
            }
        }
        return finalPath;
    }

    static async get(path, options={}){
        try {
            let response = await fetch(this.buildRequestURL(path, options),{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            return {response, data};
        } catch (error) {
            throw error;
        }
    }

    static async post(path, postData, options={}){
        try {
            let response = await fetch(this.buildRequestURL(path, options),{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });
            const data = await response.json();
            return {response, data};
        } catch (error) {
            throw error;
        }
    }

}

export default Request;
