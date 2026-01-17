import { Staff } from './types'

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
  } catch (error) {
    console.error('Failed to initialize staff data:', error)
  }
}
