import { Suspense } from "react"
import BookingFormWrapper from "@/components/booking/booking-form-wrapper"

export default function BookAppointmentPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Book a Repair Appointment</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Fill out the form below to schedule a repair appointment with our expert technicians.
        </p>
      </div>

      <div className="mt-12">
        <Suspense fallback={<div className="text-center py-8">Loading booking form...</div>}>
          <BookingFormWrapper />
        </Suspense>
      </div>

      <div className="mt-16 space-y-8 rounded-lg bg-muted p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">What to Expect</h2>
          <p className="mt-2 text-muted-foreground">Here's what happens after you book your appointment</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              1
            </div>
            <h3 className="mt-4 text-lg font-medium">Confirmation</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You'll receive an email and SMS confirmation of your appointment
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              2
            </div>
            <h3 className="mt-4 text-lg font-medium">Diagnosis</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Our technicians will diagnose your device and provide a repair quote
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              3
            </div>
            <h3 className="mt-4 text-lg font-medium">Repair</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Once approved, we'll repair your device and notify you when it's ready
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
