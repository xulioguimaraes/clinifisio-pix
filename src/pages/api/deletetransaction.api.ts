import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../services/supabase";

export default async (request: NextApiRequest, response: NextApiResponse)=>{
    if (request.method === "POST") {     
        const obj =  request.body
           
        const { data, error } = await supabase.from("transation").delete()
        .match(obj)
        
        if (data) {
            return response.status(200).json(data)
        }
        return response.status(400).json(error)
    }
}