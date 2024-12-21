import { NextRequest,NextResponse } from "next/server";
import prisma from "@/utils/dp";
export async function POST (request:NextRequest) {
    
    const body= await request.json()
    try {
        const product = await prisma.product.update({
            where:{id:body.id} ,
            data:{isAvailableForPurchase:body.isAvailableForPurchase}})
        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false }, { status: 400 });
    }
}