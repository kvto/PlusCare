"use client";
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation";
import { createUser, registerPatient } from "@/lib/actions/patient.action"
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image"
import { FileUploader } from "../FileUploader";




const RegisterForm = ({user}: {user: User}) => {

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  })
 
  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);
      
    let formData;

    if(values.identificationDocument && values.identificationDocument.length > 0){
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      })

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name)
    }
    try {
      const patient = {
        userId: user.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
        privacyConsent: values.privacyConsent,
      };

      const newPatient = await registerPatient(patient);

      if (newPatient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
            <h1>Bienvenido 🖐</h1>
            <p className="text-dark-700">Agenda tu primera cita</p>
        </section>
        
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Información personal</h2>
            </div>
        </section>

        <CustomFormField 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="name"
        label="Nombre completo"
        placeholder="Luis Perez"
        iconSrc="/assets/icons/user.svg"
        iconAlt="user"/>

        <div className="flex flex-col gap-6 xl:flex-row">
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
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
        fieldType={FormFieldType.DATE_PICKER}
        control={form.control}
        name="birthDate"
        label="Fecha de Nacimiento"
        />

        <CustomFormField
        fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="gender"
              label="Gender"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option, i) => (
                      <div key={option + i} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
        )}
        />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="address"
        label="Dirección"
        placeholder="Jr. Union 999 - Lima, Perú"
        />

        <CustomFormField 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="occupation"
        label="Ocupación"
        placeholder="Ingeniero de Software"
        />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="emergencyContactName"
        label="Nombre - Contacto de emergencia"
        placeholder="Juan Perez"
        />

        <CustomFormField 
        fieldType={FormFieldType.PHONE_INPUT}
        control={form.control}
        name="emergencyContactNumber"
        label="Numero - Contacto de emergencia"
        placeholder="+51 999 999 999"
        />
        </div>

         <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Información medica</h2>
            </div>
        </section> 

        <CustomFormField 
        fieldType={FormFieldType.SELECT}
        control={form.control}
        name="primaryPhysician"
        label="Medico primario"
        placeholder="Seleccione su medico primario">
            {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                    <div className="flex cursor-pointer items-center gap-2">
                        <Image 
                        src={doctor.image}
                        width={32}
                        height={32}
                        alt={doctor.name}
                        className="rounded-full border border-dark-500"/>
                        <p>{doctor.name}</p>
                    </div>
                </SelectItem>
            ))}
        </CustomFormField>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="insuranceProvider"
        label="Proveedor de seguros"
        placeholder="Pacifico Seguros"
        />

        <CustomFormField 
        fieldType={FormFieldType.PHONE_INPUT}
        control={form.control}
        name="insurancePolicyNumber"
        label="Número de póliza de seguro"
        placeholder="ABC123456789"
        />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="alergies"
        label="Alergias (si corresponde)"
        placeholder="Cacahuetes, penicilina y polen"
        />

        <CustomFormField 
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="currentMedication"
        label="Medicación actual (si corresponde)"
        placeholder="Ibuprofeno 200mg, Paracetamol 500mg"
        />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="familyMedicalHistory"
        label="Historial médico familiar"
        placeholder="La madre tenía cáncer cerebral, el padre enfermedad cardíaca"
        />

        <CustomFormField 
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="pastMedicalHistory"
        label="Historial médico pasado"
        placeholder="Apendicectomía, amigdalectomía"
        />
        </div>

        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Identificación y Verificación</h2>
            </div>
        </section> 

        <CustomFormField 
        fieldType={FormFieldType.SELECT}
        control={form.control}
        name="identificationType"
        label="Tipo de identificación"
        placeholder="Seleccionar el tipo de identificación">
            {IdentificationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                    {type}
                </SelectItem>
            ))}
        </CustomFormField>

        <CustomFormField 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="identificationNumber"
        label="Numero de dentificación"
        placeholder="123456789"
        />

        <CustomFormField
        fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="identificationDocument"
              label="Copia escaneada del documento de identidad"
              renderSkeleton={(field) => (
                <FormControl>
                <FileUploader files={field.value} onChange={field.onChange}/>
                </FormControl>
        )}
        />

        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Consent and Privacy</h2>
            </div>
        </section> 

        <CustomFormField 
        fieldType={FormFieldType.CHECKBOX}
        control={form.control}
        name="treatmentConsent"
        label="Doy mi consentimiento para el tratamiento"/>

        <CustomFormField 
        fieldType={FormFieldType.CHECKBOX}
        control={form.control}
        name="disclosureConsent"
        label="Doy mi consentimiento para la divulgación de información."/>


        <CustomFormField 
        fieldType={FormFieldType.CHECKBOX}
        control={form.control}
        name="privacyConsent"
        label="Doy mi consentimiento a la política de privacidad"/>  

        <SubmitButton isLoading={isLoading}>Comenzar...</SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm