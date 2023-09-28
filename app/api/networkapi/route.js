import connectToMongoDB from "@/lib/mongodb";
import EarnLevels from "@/models/earnLevelM";
import { NextResponse } from "next/server";
import { verifyAuth } from '@/auth/verifyToken';
import { FETCH_CACHE_HEADER } from "next/dist/client/components/app-router-headers";

const dataFromToken = async(token)=>{
    const data = await verifyAuth(token);
    return data;
}


// GET request
export async function GET(req) {
    console.log(req.url);
    let result;
    try{
        const token = await req.cookies.get("authToken")?.value || '';
    const isUser = await dataFromToken(token);
    if(isUser.success){
        const userid = isUser.userId;
            await connectToMongoDB();
            const isData = await EarnLevels.findOne({ 'userId': userid.toString()},["-userId","-createdAt","-_id"]);
            if(isData !== null){
                result = {data:isData,success:true};
                return NextResponse.json(result,{status:200});
            }else{
                result = {data:"Plan Buy Now",success:false};
                return NextResponse.json(result,{status:200});
            }
    }else{
        result = {error:isUser.error,success:false};
        return NextResponse.json(result,{status:200});
    }  
}catch(err){
    result = {error:"server problem Try Again!",success:false};
return NextResponse.json(result,{status:403});
}
}

