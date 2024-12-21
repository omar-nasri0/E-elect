"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import formatNumber from "format-number";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";

interface InputField {
    name: string;
    htmlFor: string;
    type: string;
    id: string;
    dec: string;
}

interface Prop {
    input: InputField[];
    edit?: Product | null;
}

interface Handle {
    name: string;
    id: string;
}

interface ProductData {
    [key: string]: string | number | File | undefined;
}

function ProductsForm({ input }: Prop) {
    const formatCurrency = formatNumber({ prefix: "$", integerSeparator: "," });
    const [priceInCents, setPriceInCents] = useState<number | undefined>(0);
    const [data, setData] = useState<ProductData>({});
    const [errors, setErrors] = useState<Record<string, string | number>>({});
    const router = useRouter();

    useEffect(() => {
        const initialData: ProductData = {};
        input.forEach(e => {
            initialData[e.name] = "";
        });
        setData(initialData);
    }, [input]);

    const handle = (event: React.ChangeEvent<HTMLInputElement>, { name, id }: Handle) => {
        const value = event.target.value;
        const file = event.target.files?.[0];

        setData(prevData => {
            const updatedData = { ...prevData };

            if (file && (id === "file" || id === "image")) {
                updatedData[name] = file;
            } else if (id === "PriceInCents") {
                const numericValue = Number(value);
                setPriceInCents(numericValue);
                updatedData[name] = numericValue;
            } else {
                updatedData[name] = value;
            }

            return updatedData;
        });

        setErrors(prevErrors => ({ ...prevErrors, [name]: "" }));
    };

    const send = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value);
            } else {
                formData.append(key, value?.toString() || "");
            }
        });

        try {
            await axios.post("http://localhost:3000/api/products", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            router.push("/admin/products");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Error message:", err.message);
                if (err.response) {
                    const errorData = err.response.data.errors || {};
                    setErrors(errorData);
                }
            } else {
                console.error("Unexpected error:", err);
            }
        }
    };

    return (
        <form className="space-y-8" onSubmit={send}>
            {input.map((field, i) => (
                <div className="space-y-1" key={i}>
                    <Label htmlFor={field.name}>{field.dec}</Label>
                    <Input
                        type={field.type}
                        id={field.id}
                        name={field.name}
                        required={field.type !== "file"}
                        onChange={event => handle(event, { name: field.name, id: field.id })}
                    />
                    {field.name === "PriceInCents" && (
                        <div className="text-muted-foreground">
                            {formatCurrency((priceInCents || 0) / 100)}
                        </div>
                    )}
                    {errors[field.name] && <div className="text-red-500">{errors[field.name]}</div>}
                </div>
            ))}
            <Button>Save</Button>
        </form>
    );
}

export default ProductsForm;
