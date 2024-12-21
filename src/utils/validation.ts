import { z } from "zod";

const addSchema = z.object({
    name: z
        .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        })
        .min(1, { message: "Name must be at least 1 character long" }),
        
    description: z
        .string({
            required_error: "Description is required",
            invalid_type_error: "Description must be a string",
        })
        .min(1, { message: "Description must be at least 1 character long" }),

        
});

export default addSchema;
