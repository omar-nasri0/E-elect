import { NextRequest, NextResponse } from "next/server";
import Tr from "@/utils/tr";
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

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as File | null;
    const image: File | null = data.get('image') as File | null;

    if (!file || !image) {
      return NextResponse.json(
        { message: 'Missing file or image' },
        { status: 400 }
      );
    }
    const uploadDir = join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const filePath = join(uploadDir, file.name);
    await writeFile(filePath, fileBuffer);

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const imagePath = join(uploadDir, image.name);
    await writeFile(imagePath, imageBuffer);

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

    const newProduct: Product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        priceInCents: body.PriceInCents,
        filePath: `/uploads/${file.name}`,
        imagePath: `/uploads/${image.name}`,
      },
    });

    return NextResponse.json(newProduct, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
