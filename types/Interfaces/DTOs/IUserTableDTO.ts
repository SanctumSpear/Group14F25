export interface IUserTableDTO {
    user_id: string; // Auto-generated, always present after insertion
    user_firstName: string;
    user_lastName: string
    user_email: string;
    user_createdAt: Date;   // Auto-generated, always present after insertion
}

// DTO for creating a new user (excludes auto-generated fields)
export type IUserTableInsertDTO = Omit<IUserTableDTO, "user_id" | "user_createdAt">;