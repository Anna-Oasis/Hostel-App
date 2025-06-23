  import { badgeStatus } from '@/components/ApprovalCard'
  
  export const getAdmissionBadgeStatus = (status: string) => {
      if (status === "4") return badgeStatus.Approved
      if (status === "-1") return badgeStatus.Rejected
    return badgeStatus.Pending
  }