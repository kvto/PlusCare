"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import router from "next/router"

export enum FormFieldType {
    INPUT = "input",
    TEXTAREA="textarea",
    PHONE_INPUT="phoneInput",
    CHECKBOX="checkbox",
    DATA_PICKER="datePicker",
    SELECT="select",
    SKELETON="skeleton",
}


const PatientForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })
 
  async function onSubmit({name, email, phone}: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);

    try{
      const userData = {name, email, phone}

      const user = await createUser(userData);

      if(user) router.push(`/patients/${user.id}/register`)


    } catch (error){
      console.log(error)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
            <h1>Hola, a todos 🖐</h1>
            <p className="text-dark-700">Agenda tu primera cita</p>
        </section>
        
        <CustomFormField 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="name"
        label="Nombre completo"
        placeholder="Luis Perez"
        iconSrc="/assets/icons/user.svg"
        iconAlt="user"/>

        <CustomFormField 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="email"
        label="Correo electronico"
        placeholder="luisperez@luisperez.com"
        iconSrc="/assets/icons/email.svg"
        iconAlt="email"/>

        <CustomFormField 
        fieldType={FormFieldType.PHONE_INPUT}
        control={form.control}
        name="phone"
        label="Numero telefonico"
        placeholder="+51 999 999 999"
        iconSrc="/assets/icons/email.svg"
        />

        <SubmitButton isLoading={isLoading}>Comenzar ahora</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm