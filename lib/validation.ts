import { z } from "zod";

export const UserFormValidation = z.object({
    name: z.string()
    .min(2, "Nombre debe tener al menos 2 letras")  
    .max(50, "Nombre debe tener como maximo 30 letras"),  
    email: z.string().email("Correo electronico invalido"),
    phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Telefono invalido"),
});

   