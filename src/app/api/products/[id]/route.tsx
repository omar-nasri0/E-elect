import { NextRequest, NextResponse } from "next/server";
import addSchema from "@/utils/validation";
import prisma from "@/utils/dp";
import { Product } from "@prisma/client";
import { join } from "path";
import { writeFile } from "fs/promises";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function PUT(request: NextRequest) {
    console.log('rogjr')
  try {
    const data = await request.formData();
    const productId = data.get('id') as string; // تأكد من أنك ترسل id المنتج في الطلب
    const file: File | null = data.get('file') as File | null;
    const image: File | null = data.get('image') as File | null;

    if (!productId) {
      return NextResponse.json(
        { message: 'Missing product ID' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    const uploadDir = join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // التعامل مع الملف الجديد
    let filePath = product.filePath;
    if (file) {
      // إذا تم إرسال ملف جديد، احفظه
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      filePath = join(uploadDir, file.name);
      await writeFile(filePath, fileBuffer);
      
      // حذف الملف القديم إذا كان موجود
      if (product.filePath) {
        const oldFilePath = join(process.cwd(), 'public', product.filePath);
        if (fs.existsSync(oldFilePath)) {
          await fs.promises.unlink(oldFilePath); // حذف الملف القديم بشكل غير تزامني
        }
      }
    }

    // التعامل مع الصورة الجديدة
    let imagePath = product.imagePath;
    if (image) {
      // إذا تم إرسال صورة جديدة، احفظها
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      imagePath = join(uploadDir, image.name);
      await writeFile(imagePath, imageBuffer);
      
      // حذف الصورة القديمة إذا كانت موجودة
      if (product.imagePath) {
        const oldImagePath = join(process.cwd(), 'public', product.imagePath);
        if (fs.existsSync(oldImagePath)) {
          await fs.promises.unlink(oldImagePath); // حذف الصورة القديمة بشكل غير تزامني
        }
      }
    }

    const body = {
      name: data.get('name') as string,
      description: data.get('description') as string,
      PriceInCents: Number(data.get('PriceInCents')),
    };

    const validation = addSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {} as Record<string, string>);

      return NextResponse.json({ errors }, { status: 400 });
    }

    // تحديث المنتج في قاعدة البيانات
    const updatedProduct: Product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: body.name,
        description: body.description,
        priceInCents: body.PriceInCents,
        filePath: `/uploads/${file?.name || product.filePath.split('/').pop()}`, // إذا كان هناك ملف جديد
        imagePath: `/uploads/${image?.name || product.imagePath.split('/').pop()}`, // إذا كانت هناك صورة جديدة
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
