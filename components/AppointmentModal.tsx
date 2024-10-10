import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from './ui/button';
import { Appointment } from '@/types/appwrite.types';
import AppointmentForm from './forms/AppointmentForm';
  
const AppointmentModal = ({
    type,
    patientId,
    userId,
    appointment,
}: {
    type: "agendar" | "cancel",
    patientId: string,
    userId: string, 
    appointment?: Appointment,
}) => {
    const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button variant="ghost" className={`capitalize ${type === "agendar" && "text-green-500"}`}>
    {type}
    </Button>
  </DialogTrigger>
  <DialogContent className='shad-dialog sm:max-w-md'>
    <DialogHeader className='mb-4 space-y-3'>
      <DialogTitle className='capitalize'>{type} Cita</DialogTitle>
      <DialogDescription>
      Por favor, rellene los siguientes datos para {type} una cita:      </DialogDescription>
    </DialogHeader>

    <AppointmentForm 
    userId={userId}
    patientId={patientId}
    type={type}
    appointment={appointment}
    setOpen={setOpen}/>
  </DialogContent>
</Dialog>

  )
}

export default AppointmentModal