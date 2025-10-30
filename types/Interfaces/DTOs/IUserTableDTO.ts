export interface IUserTableFetchDTO {
    app_user_id: string; // Auto-generated, always present after insertion
    app_user_firstName: string;
    app_user_lastName: string
    app_user_email: string;
    app_user_createdAt: Date;   // Auto-generated, always present after insertion
}

// DTO for creating a new user (excludes auto-generated fields)
export type IUserTableInsertDTO = Omit<IUserTableFetchDTO, "app_user_id" | "app_user_createdAt">;