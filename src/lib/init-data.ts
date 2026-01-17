import { Staff, Appointment } from './types'

export async function initializeStaffData() {
  try {
    const existingStaff = await window.spark.kv.get<Staff[]>('staff')
    
    if (!existingStaff || existingStaff.length === 0) {
      const initialStaff: Staff[] = [
        {
          id: "1",
          name: "Sarah Johnson",
          role: "Senior Groomer",
          email: "sarah.j@scruffybutts.com",
          phone: "(555) 123-4567",
          status: "Active",
          isGroomer: true
        },
        {
          id: "2",
          name: "Mike Torres",
          role: "Groomer",
          email: "mike.t@scruffybutts.com",
          phone: "(555) 234-5678",
          status: "Active",
          isGroomer: true
        },
        {
          id: "3",
          name: "Emma Roberts",
          role: "Spa Specialist",
          email: "emma.r@scruffybutts.com",
          phone: "(555) 345-6789",
          status: "Active",
          isGroomer: true
        },
        {
          id: "4",
          name: "Carlos Martinez",
          role: "Bather",
          email: "carlos.m@scruffybutts.com",
          phone: "(555) 456-7890",
          status: "Active",
          isGroomer: false
        },
        {
          id: "5",
          name: "Lisa Chen",
          role: "Groomer",
          email: "lisa.c@scruffybutts.com",
          phone: "(555) 567-8901",
          status: "On Leave",
          isGroomer: true
        }
      ]
      
      await window.spark.kv.set('staff', initialStaff)
      console.log('Staff data initialized')
    } else {
      const needsUpdate = existingStaff.some(s => s.isGroomer === undefined)
      
      if (needsUpdate) {
        const updatedStaff = existingStaff.map(s => ({
          ...s,
          isGroomer: s.isGroomer !== undefined 
            ? s.isGroomer 
            : ['Groomer', 'Senior Groomer', 'Spa Specialist'].some(role => s.role.includes(role))
        }))
        
        await window.spark.kv.set('staff', updatedStaff)
        console.log('Staff data migrated with isGroomer property')
      }
    }

    await migrateAppointmentGroomerIds()
  } catch (error) {
    console.error('Failed to initialize staff data:', error)
  }
}

async function migrateAppointmentGroomerIds() {
  try {
    const appointments = await window.spark.kv.get<Appointment[]>('appointments')
    const staff = await window.spark.kv.get<Staff[]>('staff')
    
    if (!appointments || !staff || appointments.length === 0) {
      return
    }

    const groomers = staff.filter(s => s.isGroomer)
    
    if (groomers.length === 0) {
      console.warn('No groomers found in staff data')
      return
    }

    let needsUpdate = false
    const updatedAppointments = appointments.map(apt => {
      const groomerExists = groomers.some(g => g.id === apt.groomerId)
      
      if (!groomerExists) {
        needsUpdate = true
        const matchingGroomer = groomers.find(g => g.name === apt.groomerName)
        
        if (matchingGroomer) {
          console.log(`Migrating appointment ${apt.id} groomer ID from ${apt.groomerId} to ${matchingGroomer.id}`)
          return {
            ...apt,
            groomerId: matchingGroomer.id
          }
        } else {
          const firstGroomer = groomers[0]
          console.log(`Assigning appointment ${apt.id} to default groomer ${firstGroomer.id}`)
          return {
            ...apt,
            groomerId: firstGroomer.id,
            groomerName: firstGroomer.name
          }
        }
      }
      
      return apt
    })

    if (needsUpdate) {
      await window.spark.kv.set('appointments', updatedAppointments)
      console.log('Appointment groomer IDs migrated successfully')
    }
  } catch (error) {
    console.error('Failed to migrate appointment groomer IDs:', error)
  }
}
