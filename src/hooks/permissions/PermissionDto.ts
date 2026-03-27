export interface PermissionDto {
  id?: string;
  name: string;
  description: string;
  displayOrder: number;
  code: string;
}

export interface CreateRolePermissionDto {
  roleId: string;
  permissionId: string;
}

export interface CreateUserPermissionDto {
  userId: string;
  permissionId: string;
  isGranted: boolean;
}

export interface UpdateUserPermissionDto {
  isGranted: boolean;
}
