  import { badgeStatus } from '@/components/ApprovalCard'
  
  export const getAdmissionBadgeStatus = (status: string) => {
      if (status === "3") return badgeStatus.Approved
      if (status === "-1") return badgeStatus.Rejected
    return badgeStatus.Pending
  }

   export const getGrievanceBadgeStatus = (status: string) => {
      if (status === "1") return badgeStatus.Approved
      if (status === "-1") return badgeStatus.Rejected
    return badgeStatus.Pending
  }

  export const getSummerVacationBadgeStatus = (status: string) => {
      if (status === "2") return badgeStatus.Approved
      if (status === "-1") return badgeStatus.Rejected
    return badgeStatus.Pending
  }

  export const getHostelVacationBadgeStatus = (status: number) => {
      if (status === 3) return badgeStatus.Approved
      if (status === -1) return badgeStatus.Rejected
    return badgeStatus.Pending
  }

  export const getLeaveBadgeStatus = (status: string) => {
      if (status === "2") return badgeStatus.Approved
      if (status === "-1") return badgeStatus.Rejected
    return badgeStatus.Pending
  }

  export const getRCLeaveBadgeStatus = (status: string) => {
      if (status === "2") return badgeStatus.Approved
      if (status === "-1") return badgeStatus.Rejected
    return badgeStatus.Pending
  }