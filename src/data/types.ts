
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'director' | 'admin' | 'teacher' | 'parent';
    avatar?: string;
    password?: string; // Add password for local auth
}
