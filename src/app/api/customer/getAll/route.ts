import prisma from "@/utils/dp";
import { NextRequest, NextResponse } from "next/server";

export async  function GET () {
        try {
            const products =await prisma.product.findMany({
                where:{isAvailableForPurchase:true},
                orderBy:{createdAdd:"asc"},
            })
                return NextResponse.json(products,{status:200})
        } catch (error) {
            return NextResponse.json({message:"internal server error"}
                ,{status:500})
        }
}