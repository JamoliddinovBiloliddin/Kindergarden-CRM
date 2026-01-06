import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    Branch,
    Group,
    Student,
    Teacher,
    Parent,
    FinancialRecord,
    Meal,
    Vaccination,
    Activity,
    WarehouseItem,
    SleepRecord,
    Homework,
    Complaint,

    User,
    Notification as AppNotification
} from '@/data/mockData';

interface DataContextType {
    branches: Branch[];
    groups: Group[];
    students: Student[];
    teachers: Teacher[];
    parents: Parent[];
    financialRecords: FinancialRecord[];
    meals: Meal[];
    vaccinations: Vaccination[];
    activities: Activity[];
    warehouseItems: WarehouseItem[];
    sleepRecords: SleepRecord[];
    homeworks: Homework[];
    complaints: Complaint[];

    users: User[];

    // Update functions
    addBranch: (branch: Branch) => void;
    updateBranch: (branch: Branch) => void;
    deleteBranch: (id: string) => void;

    addGroup: (group: Group) => void;
    updateGroup: (group: Group) => void;
    deleteGroup: (id: string) => void;

    addStudent: (student: Student) => void;
    updateStudent: (student: Student) => void;
    deleteStudent: (id: string) => void;

    addTeacher: (teacher: Teacher) => void;
    updateTeacher: (teacher: Teacher) => void;
    deleteTeacher: (id: string) => void;

    addParent: (parent: Parent) => void;
    updateParent: (parent: Parent) => void;
    deleteParent: (id: string) => void;

    addFinancialRecord: (record: FinancialRecord) => void;
    updateFinancialRecord: (record: FinancialRecord) => void;
    deleteFinancialRecord: (id: string) => void;

    addMeal: (meal: Meal) => void;
    updateMeal: (meal: Meal) => void;
    deleteMeal: (id: string) => void;

    addActivity: (activity: Activity) => void;
    updateActivity: (activity: Activity) => void;
    deleteActivity: (id: string) => void;

    addWarehouseItem: (item: WarehouseItem) => void;
    updateWarehouseItem: (item: WarehouseItem) => void;
    deleteWarehouseItem: (id: string) => void;

    addHomework: (homework: Homework) => void;
    updateHomework: (homework: Homework) => void;
    deleteHomework: (id: string) => void;

    addComplaint: (complaint: Complaint) => void;
    updateComplaint: (complaint: Complaint) => void;
    deleteComplaint: (id: string) => void;

    addVaccination: (vaccination: Vaccination) => void;
    updateVaccination: (vaccination: Vaccination) => void;
    deleteVaccination: (id: string) => void;

    addSleepRecord: (record: SleepRecord) => void;
    updateSleepRecord: (record: SleepRecord) => void;
    deleteSleepRecord: (id: string) => void;



    addUser: (user: User) => void;
    updateUser: (user: User) => void;
    deleteUser: (id: string) => void;

    notifications: AppNotification[];
    addNotification: (notification: AppNotification) => void;
    updateNotification: (notification: AppNotification) => void;
    deleteNotification: (id: string) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: (userId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Helper to load from localStorage
    const loadData = <T,>(key: string, defaultValue: T): T => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (e) {
            console.error(`Error loading ${key}`, e);
            return defaultValue;
        }
    };

    // Helper to save to localStorage
    const saveData = <T,>(key: string, data: T) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Error saving ${key}`, e);
        }
    };

    // State initialization
    const [branches, setBranches] = useState<Branch[]>(() => loadData('branches', []));
    const [groups, setGroups] = useState<Group[]>(() => loadData('groups', []));
    const [students, setStudents] = useState<Student[]>(() => loadData('students', []));
    const [teachers, setTeachers] = useState<Teacher[]>(() => loadData('teachers', []));
    const [parents, setParents] = useState<Parent[]>(() => loadData('parents', []));
    const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>(() => loadData('financialRecords', []));
    const [meals, setMeals] = useState<Meal[]>(() => loadData('meals', []));
    const [vaccinations, setVaccinations] = useState<Vaccination[]>(() => loadData('vaccinations', []));
    const [activities, setActivities] = useState<Activity[]>(() => loadData('activities', []));
    const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>(() => loadData('warehouseItems', []));
    const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>(() => loadData('sleepRecords', []));
    const [homeworks, setHomeworks] = useState<Homework[]>(() => loadData('homeworks', []));
    const [complaints, setComplaints] = useState<Complaint[]>(() => loadData('complaints', []));

    const [users, setUsers] = useState<User[]>(() => loadData('users', []));
    const [notifications, setNotifications] = useState<AppNotification[]>(() => loadData('notifications', []));

    // Listen for storage events to sync across tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'branches') setBranches(loadData('branches', []));
            if (e.key === 'groups') setGroups(loadData('groups', []));
            if (e.key === 'students') setStudents(loadData('students', []));
            if (e.key === 'teachers') setTeachers(loadData('teachers', []));
            if (e.key === 'parents') setParents(loadData('parents', []));
            if (e.key === 'financialRecords') setFinancialRecords(loadData('financialRecords', []));
            if (e.key === 'meals') setMeals(loadData('meals', []));
            if (e.key === 'vaccinations') setVaccinations(loadData('vaccinations', []));
            if (e.key === 'activities') setActivities(loadData('activities', []));
            if (e.key === 'warehouseItems') setWarehouseItems(loadData('warehouseItems', []));
            if (e.key === 'sleepRecords') setSleepRecords(loadData('sleepRecords', []));
            if (e.key === 'homeworks') setHomeworks(loadData('homeworks', []));
            if (e.key === 'complaints') setComplaints(loadData('complaints', []));

            if (e.key === 'users') setUsers(loadData('users', []));
            if (e.key === 'notifications') setNotifications(loadData('notifications', []));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Sync effects
    useEffect(() => saveData('branches', branches), [branches]);
    useEffect(() => saveData('groups', groups), [groups]);
    useEffect(() => saveData('students', students), [students]);
    useEffect(() => saveData('teachers', teachers), [teachers]);
    useEffect(() => saveData('parents', parents), [parents]);
    useEffect(() => saveData('financialRecords', financialRecords), [financialRecords]);
    useEffect(() => saveData('meals', meals), [meals]);
    useEffect(() => saveData('vaccinations', vaccinations), [vaccinations]);
    useEffect(() => saveData('activities', activities), [activities]);
    useEffect(() => saveData('warehouseItems', warehouseItems), [warehouseItems]);
    useEffect(() => saveData('sleepRecords', sleepRecords), [sleepRecords]);
    useEffect(() => saveData('homeworks', homeworks), [homeworks]);
    useEffect(() => saveData('complaints', complaints), [complaints]);

    useEffect(() => saveData('users', users), [users]);
    useEffect(() => saveData('notifications', notifications), [notifications]);

    // Force inject Superadmin if missing (self-healing for existing localStorage)
    useEffect(() => {
        const superAdminExists = users.some(u => u.email === 'super@kindergarten.uz');
        if (!superAdminExists) {
            setUsers(prev => [...prev, {
                id: 'super-admin-root',
                name: 'Super Admin',
                email: 'super@kindergarten.uz',
                role: 'superadmin',
                password: '1234',
                status: 'active',
                createdAt: '2024-01-01'
            }]);
        }
    }, [users]);

    // Actions
    const addBranch = (item: Branch) => setBranches(prev => [...prev, item]);
    const updateBranch = (item: Branch) => setBranches(branches.map(i => i.id === item.id ? item : i));
    const deleteBranch = (id: string) => {
        // Cascade delete logic could go here, but for now strict deletion
        setBranches(branches.filter(i => i.id !== id));
    };

    const addGroup = (item: Group) => setGroups(prev => [...prev, item]);
    const updateGroup = (item: Group) => setGroups(groups.map(i => i.id === item.id ? item : i));
    const deleteGroup = (id: string) => setGroups(groups.filter(i => i.id !== id));

    const addStudent = (item: Student) => setStudents(prev => [...prev, item]);
    const updateStudent = (item: Student) => setStudents(students.map(i => i.id === item.id ? item : i));
    const deleteStudent = (id: string) => {
        setStudents(students.filter(i => i.id !== id));
        // Remove student ID from parent's childrenIds
        setParents(parents.map(p => {
            if (p.childrenIds.includes(id)) {
                return { ...p, childrenIds: p.childrenIds.filter(cid => cid !== id) };
            }
            return p;
        }));
    };

    const addTeacher = (item: Teacher) => setTeachers(prev => [...prev, item]);
    const updateTeacher = (item: Teacher) => setTeachers(teachers.map(i => i.id === item.id ? item : i));
    const deleteTeacher = (id: string) => {
        const teacher = teachers.find(t => t.id === id);
        if (teacher) {
            setUsers(users.filter(u => !(u.email === teacher.email && u.role === 'teacher')));
        }
        setTeachers(teachers.filter(i => i.id !== id));
    };

    const addParent = (item: Parent) => setParents(prev => [...prev, item]);
    const updateParent = (item: Parent) => setParents(parents.map(i => i.id === item.id ? item : i));
    const deleteParent = (id: string) => {
        const parent = parents.find(p => p.id === id);
        if (parent) {
            setUsers(users.filter(u => !(u.email === parent.email && u.role === 'parent')));
        }
        setParents(parents.filter(i => i.id !== id));
    };

    const addFinancialRecord = (item: FinancialRecord) => setFinancialRecords(prev => [...prev, item]);
    const updateFinancialRecord = (item: FinancialRecord) => setFinancialRecords(financialRecords.map(i => i.id === item.id ? item : i));
    const deleteFinancialRecord = (id: string) => setFinancialRecords(financialRecords.filter(i => i.id !== id));

    const addMeal = (item: Meal) => setMeals(prev => [...prev, item]);
    const updateMeal = (item: Meal) => setMeals(meals.map(i => i.id === item.id ? item : i));
    const deleteMeal = (id: string) => setMeals(meals.filter(i => i.id !== id));

    const addActivity = (item: Activity) => setActivities(prev => [...prev, item]);
    const updateActivity = (item: Activity) => setActivities(activities.map(i => i.id === item.id ? item : i));
    const deleteActivity = (id: string) => setActivities(activities.filter(i => i.id !== id));

    const addWarehouseItem = (item: WarehouseItem) => setWarehouseItems(prev => [...prev, item]);
    const updateWarehouseItem = (item: WarehouseItem) => setWarehouseItems(warehouseItems.map(i => i.id === item.id ? item : i));
    const deleteWarehouseItem = (id: string) => setWarehouseItems(warehouseItems.filter(i => i.id !== id));

    const addHomework = (item: Homework) => setHomeworks(prev => [...prev, item]);
    const updateHomework = (item: Homework) => setHomeworks(homeworks.map(i => i.id === item.id ? item : i));
    const deleteHomework = (id: string) => setHomeworks(homeworks.filter(i => i.id !== id));

    const addComplaint = (item: Complaint) => setComplaints(prev => [...prev, item]);
    const updateComplaint = (item: Complaint) => setComplaints(complaints.map(i => i.id === item.id ? item : i));
    const deleteComplaint = (id: string) => setComplaints(complaints.filter(i => i.id !== id));

    const addVaccination = (item: Vaccination) => setVaccinations(prev => [...prev, item]);
    const updateVaccination = (item: Vaccination) => setVaccinations(vaccinations.map(i => i.id === item.id ? item : i));
    const deleteVaccination = (id: string) => setVaccinations(vaccinations.filter(i => i.id !== id));

    const addSleepRecord = (item: SleepRecord) => setSleepRecords(prev => [...prev, item]);
    const updateSleepRecord = (item: SleepRecord) => setSleepRecords(sleepRecords.map(i => i.id === item.id ? item : i));
    const deleteSleepRecord = (id: string) => setSleepRecords(sleepRecords.filter(i => i.id !== id));



    const addUser = (item: User) => setUsers(prev => [...prev, item]);
    const updateUser = (item: User) => setUsers(users.map(i => i.id === item.id ? item : i));
    const deleteUser = (id: string) => setUsers(users.filter(i => i.id !== id));

    const addNotification = (item: AppNotification) => setNotifications(prev => [item, ...prev]);
    const updateNotification = (item: AppNotification) => setNotifications(notifications.map(i => i.id === item.id ? item : i));
    const deleteNotification = (id: string) => setNotifications(notifications.filter(i => i.id !== id));
    const markAsRead = (id: string) => setNotifications(notifications.map(i => i.id === id ? { ...i, read: true } : i));
    const markAllAsRead = (userId: string) => setNotifications(notifications.map(i => i.userId === userId ? { ...i, read: true } : i));

    return (
        <DataContext.Provider value={{
            branches, addBranch, updateBranch, deleteBranch,
            groups, addGroup, updateGroup, deleteGroup,
            students, addStudent, updateStudent, deleteStudent,
            teachers, addTeacher, updateTeacher, deleteTeacher,
            parents, addParent, updateParent, deleteParent,
            financialRecords, addFinancialRecord, updateFinancialRecord, deleteFinancialRecord,
            meals, addMeal, updateMeal, deleteMeal,
            activities, addActivity, updateActivity, deleteActivity,
            warehouseItems, addWarehouseItem, updateWarehouseItem, deleteWarehouseItem,
            sleepRecords, addSleepRecord, updateSleepRecord, deleteSleepRecord,
            homeworks, addHomework, updateHomework, deleteHomework,
            complaints, addComplaint, updateComplaint, deleteComplaint,
            vaccinations, addVaccination, updateVaccination, deleteVaccination,

            users, addUser, updateUser, deleteUser,
            notifications, addNotification, updateNotification, deleteNotification, markAsRead, markAllAsRead
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
