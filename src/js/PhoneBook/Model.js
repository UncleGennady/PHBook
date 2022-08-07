import {
    contactKey
} from './config.js';
class Model {

    #setID = function* (id){
        let index = id;
        while(true)
            yield index++;
    };
    changeData(currentId,data){
        const saveData = structuredClone(data);
        saveData.id = currentId;
        let response = null;
        const localData = this.getData(contactKey);

        const  currentContact = localData.find(i => i.id === (+currentId));

        console.log(currentContact)
        for (const currentContactKey in currentContact) {
                currentContact[currentContactKey] = saveData[currentContactKey];
        }
        console.log(currentContact)

        try{
            localStorage.setItem(contactKey,JSON.stringify(localData));
            response = {
                success: true,
                data: saveData,
            }
        }
        catch (e){
            response = {
                success: false,
                errors: e,
            }
        }
        console.log(response);
        return response;

    }
    getData = key => JSON.parse(localStorage.getItem(key));

    setData(data){
        const saveData = structuredClone(data);
        const dataFromLocalStorage = this.getData(contactKey);
        const localData = dataFromLocalStorage ? dataFromLocalStorage : [];
        let idStart = (!(localData.at(-1)))? 1 : localData.at(-1).id+1;
        let id = this.#setID(idStart)

        saveData.id = id.next().value;
        let response = null;

        localData.push(saveData);
        try{
            localStorage.setItem(contactKey,JSON.stringify(localData));
            response = {
                success: true,
                data: saveData,
            }
        }
        catch (e){
            response = {
                success: false,
                errors: e,
            }
        }
        console.log(response);
        return response;
    }
    resetData(data, id){
        data.forEach(item => {if(item.id === id) data.splice(data.indexOf(item), 1)});
        localStorage.removeItem(contactKey);
        if(!!data.length) localStorage.setItem(contactKey,JSON.stringify(data));
        return data;
    }

}


export default Model;