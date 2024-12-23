import { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "../../services/supabase"

export default async (request: NextApiRequest, response: NextApiResponse) =>{
    if (request.method === "GET") {
        const { data: dateTypeTrue, error:errorTypeTrue } = await supabase.from("transation")
        .select("created_at")
        .eq('type', "true")
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
        
        const { data: dateTypeFalse, error:errorTypeFalse } = await supabase.from("transation")
        .select("created_at")
        .eq('type', "false")
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
        
        const data ={
            dateTypeTrue,
            dateTypeFalse
        }
        const error ={
            errorTypeTrue,
            errorTypeFalse
        }

        if (data) {
            return response.status(200).json(data)
        }
        return response.status(400).json(error)
    }
}