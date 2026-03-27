export interface CreateRoleDto {
  name: string;
  description: string;
  displayOrder: number;
}

export interface RoleDto extends CreateRoleDto {
  id: string;
}
