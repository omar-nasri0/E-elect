import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/dp";
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    const data = await request.json();
    try {
        // أولاً استرجاع المنتج للتحقق من مسار الصور
        const product = await prisma.product.findUnique({
            where: { id: data.id },
            select: {
                filePath: true,
                imagePath: true
            }
        });

        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        // حذف الصور من المجلد
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        
        if (product.filePath) {
            const filePath = path.join(uploadDir, product.filePath.replace('/uploads/', ''));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // حذف الصورة
            }
        }

        if (product.imagePath) {
            const imagePath = path.join(uploadDir, product.imagePath.replace('/uploads/', ''));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // حذف الصورة
            }
        }

        // الآن حذف المنتج من قاعدة البيانات
        await prisma.product.delete({
            where: { id: data.id }
        });

        return NextResponse.json({ success: true, message: "Product and associated images deleted" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Failed to delete product or images" }, { status: 500 });
    }
}
