export type AuditAction = "raffle_approved" | "raffle_rejected" | "escrow_force_release" | "user_banned" | "user_unbanned";

export type AuditLog = {
  id: string;
  adminId: string;
  adminEmail: string;
  action: AuditAction;
  targetType: "raffle" | "order" | "user";
  targetId: string;
  details: string;
  createdAt: string;
};

