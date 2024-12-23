import { api } from "./api"

export default async (id: string)=>{
   const response = await api.post("/deletetransaction",{id: id}).then(item=>{
        if (item.data[0]) {
            return true
        }
    }).catch(()=> false)
    return response
}