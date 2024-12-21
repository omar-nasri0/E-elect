"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import formatNumber from 'format-number'
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useRouter } from "next/navigation"

interface input {
    name: string
}
interface edit {
    id: string
    name: string,
    priceInCents: number
    description: string
    filePath: string,
    imagePath: string,
}
interface prop {
    input: input[] // For input elements
    edit: edit[] | any // Initial data for editing
}
interface handle {
    name: string,
    id: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function ProductFormUpdate({ input, edit }: prop) {
    const formatCurrency = formatNumber({ prefix: "$", integerSeparator: "," })
    const [priceInCents, setPriceInCents] = useState<number>(edit?.priceInCents || 0)
    const [data, setData] = useState({
        id: edit?.id,
        name: edit?.name || '',
        description: edit?.description || '',
        filePath: edit?.filePath || '',
        imagePath: edit?.imagePath || '',
        PriceInCents: priceInCents
    });
    const [file, setFile] = useState<File | null>(null) // File state
    const [img, setImg] = useState<File | null>(null) // Image state
    const [errors, setErrors] = useState<Record<string, string | number>>({})
    const router = useRouter();

    useEffect(() => {
        const object: Record<string, string | null> = {}
        input?.forEach(e => {
            object[e.name] = null
        });
    }, [input])
    
    const handle = (event: React.ChangeEvent<HTMLInputElement>, { name, id }: handle) => {
        const value = event.target.value;
        const file = event.target.files?.[0]; 

        setData(prevData => {
            const updatedData: any = { ...prevData };

            if (file && (id === "file" || id === "image")) {
                updatedData[name] = file; 
                if (id === "file") setFile(file);
                if (id === "image") setImg(file);
            } else if (id === "PriceInCents") {
                setPriceInCents(Number(value))
                updatedData[name] = Number(value); 
            } else {
                updatedData[name] = value; 
            }

            return updatedData; 
        });

        setErrors(prevErrors => ({ ...prevErrors, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!data.name) {
            newErrors.name = "Name is required";
        }

        if (data.PriceInCents <= 0) {
            newErrors.PriceInCents = "Price must be greater than zero";
        }

        if (!data.description) {
            newErrors.description = "Description is required";
        }

        return newErrors;
    };

    const Send = async (e: React.FormEvent) => {
        e.preventDefault()
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setErrors({})
        const formData = new FormData();
        formData.append('id', data.id);  // Adding the id for update
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('PriceInCents', String(data.PriceInCents));

        // Send file only if it is selected
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setErrors(prev => ({ ...prev, file: "File size is too large" }));
                return;
            }
            formData.append('file', file);
        }
        
        if (img) formData.append('image', img);

        try {
            await axios.put(`http://localhost:3000/api/products/${data.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            router.push("/admin/products");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error('Error message:', err.message);
                if (err.response) {
                    console.error('Error response data:', err.response.data);
                    const errorData = err.response.data.errors || {};
                    setErrors(errorData);
                }
            } else {
                console.error('Unexpected error:', err);
                setErrors({ general: "An unexpected error occurred, please try again." });
            }
        }
    }

    return (
        <form className="space-y-8" onSubmit={Send}>
            <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={data.name}
                    onChange={event => { handle(event, { id: "name", name: "name" }) }}
                />
                {errors["name"] && <div className="text-red-500">{errors['name']}</div>}
            </div>
            <div className="space-y-1">
                <Label htmlFor="PriceInCents">Price In Cents</Label>
                <Input
                    type="number"
                    id="PriceInCents"
                    name="PriceInCents"
                    required
                    value={data.PriceInCents}
                    onChange={event => { handle(event, { id: "PriceInCents", name: "PriceInCents" }) }}
                />
                {errors["PriceInCents"] && <div className="text-red-500">{errors["PriceInCents"]}</div>}
                <div className="text-muted-foreground">
                    {formatCurrency((priceInCents || 0) / 100)}
                </div>
            </div>
            <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Input
                    type="text"
                    id="description"
                    name="description"
                    required
                    value={data.description}
                    onChange={event => { handle(event, { id: "description", name: "description" }) }}
                />
                {errors["description"] && <div className="text-red-500">{errors["description"]}</div>}
            </div>
            <div className="space-y-1">
                <Label htmlFor="file">File</Label>
                <Input
                    type="file"
                    id="file"
                    name="file"
                    onChange={event => { handle(event, { id: "file", name: "filePath" }) }}
                />
                {data.filePath && (
                    <div className="mt-2">
                        <img src={file ? URL.createObjectURL(file) : data.filePath} className="w-32 h-32 object-cover" />
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <Label htmlFor="image">Image</Label>
                <Input
                    type="file"
                    id="image"
                    name="imagePath"
                    onChange={event => { handle(event, { id: "image", name: "imagePath" }) }}
                />
                {data.imagePath && (
                    <div className="mt-2">
                        <img src={img ? URL.createObjectURL(img) : data.imagePath} alt="Current Image" className="w-32 h-32 object-cover" />
                    </div>
                )}
            </div>
            <Button type="submit">Save</Button>
            {errors.general && <div className="text-red-500 mt-2">{errors.general}</div>}
        </form>
    )
}

export default ProductFormUpdate
