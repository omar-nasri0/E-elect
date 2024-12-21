import { NextRequest, NextResponse } from "next/server";

const storedPassword = process.env.ADMIN_PASSWORD || ""; // جلب كلمة المرور من البيئة

export async function middleware(request: NextRequest) {
    // الحصول على هيدر Authorization
    const authHeader = request.headers.get("authorization");

    // إذا لم يكن هناك هيدر للـ Authorization
    if (!authHeader) {
        return new NextResponse("Unauthorized", {
            status: 401,
            headers: {
                "www-Authenticate": "Basic realm='Admin Area'", // طلب المصادقة
            },
        });
    }

    // استخراج credentials (الاسم وكلمة المرور) من هيدر الـ Authorization
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");

    // التحقق من اسم المستخدم
    if (username !== "admin") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // التحقق من كلمة المرور المدخلة (بدون تشفير)
    if (password !== storedPassword) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // إذا كانت المصادقة صحيحة، نسمح بالمرور للطلب
    return NextResponse.next();
}

// تحديد المسارات التي سيتم تطبيق الـ middleware عليها
export const config = {
    matcher: "/admin",  // فقط المسار /admin وكل المسارات الفرعية ستكون محمية
};
