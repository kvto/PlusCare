"use client";
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";

import Image from "next/image";
import { Doctors } from "@/constants";
import { createAppointment } from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";
import { SelectItem } from "../ui/select";


const AppointmentForm = ({
    userId, patientId, type = "create",
}: {
    userId: string;
    patientId: string;
    type: "create" | "cancel" | "schedule";
    appointment?: Appointment;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);
  
  const router = useRouter();
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: "",
    },
  })
  console.log(form.watch("primaryPhysician"));

  const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }

    try {
      if(type === "create" && patientId){
        const appointemntData = {
            userId,
            patient: patientId,
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            reason: values.reason!,
            status: status as Status,
            note: values.note,
            
        }
        
        const appointment = await createAppointment(appointemntData)

        if(appointment){
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
        }
      }

    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };


  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancelar cita";
      break;
    case "schedule":
      buttonLabel = "Programar cita";
      break;
    default:
      buttonLabel = "Agendar cita";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
            <h1>Nueva cita medica 📑</h1>
            <p className="text-dark-700">Agenda una nueva cita en 10 segundos</p>
        </section>
        
        {type !== "cancel" && (
            <>

            
        <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Seleccionar un doctor" 
              >
              {Doctors.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt={doctor.name}
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

        <CustomFormField
        fieldType={FormFieldType.DATE_PICKER}
        control={form.control}
        name="schedule"
        label="Coloque la fecha de su cita"
        showTimeSelect
        dateFormat="MM/dd/yyyy - h:mm aa"/>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="reason"
        label="Razón de la cita"
        placeholder="Ingresar la razon de su cita"
        />

        <CustomFormField 
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="notes"
        label="Notas"
        placeholder="Ingresar notas"
        />
        </div>
            </>
        )}

        {type === "cancel" && (
            <CustomFormField 
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Razon de la cancelación"
            placeholder="Ingresar la razon de la cancelación"
            />
        )}
        

        <SubmitButton isLoading={isLoading} className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}>{buttonLabel}</SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm