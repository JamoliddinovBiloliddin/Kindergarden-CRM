import { useApp } from '@/contexts/AppContext';
import { useData } from '../hooks/useData';

export const useBranchedData = () => {
    const { currentBranch } = useApp();
    const data = useData();

    // Helper to filter by branch
    const filterByBranch = <T extends { branchId?: string }>(items: T[]): T[] => {
        if (currentBranch === 'all') return items;
        return items.filter(item => item.branchId === currentBranch);
    };

    // Groups are directly linked to branches
    const groups = filterByBranch(data.groups);

    // Students have branchId
    const students = filterByBranch(data.students);

    // Teachers have branchId
    const teachers = filterByBranch(data.teachers);

    // Finance has branchId
    const financialRecords = filterByBranch(data.financialRecords);

    // Warehouse has branchId
    const warehouseItems = filterByBranch(data.warehouseItems);

    // Meals have branchId
    const meals = filterByBranch(data.meals);

    // Users (Filter by branchId) 
    const users = filterByBranch(data.users);

    // Parents (Filter by having children in the current branch's students list)
    // efficient check: valid student IDs in this branch
    const validStudentIds = new Set(students.map(s => s.id));
    const parents = data.parents.filter(p => {
        if (currentBranch === 'all') return true;
        return p.childrenIds.some(id => validStudentIds.has(id));
    });

    // Activities (Filter by Group -> Branch)
    const activities = data.activities.filter(a => {
        if (currentBranch === 'all') return true;
        const group = data.groups.find(g => g.id === a.groupId);
        return group?.branchId === currentBranch;
    });



    // Complaints
    const complaints = data.complaints.filter(c => {
        if (currentBranch === 'all') return true;
        if (c.parentId) {
            const parent = data.parents.find(p => p.id === c.parentId);
            if (parent) {
                const children = data.students.filter(s => parent.childrenIds.includes(s.id));
                return children.some(s => s.branchId === currentBranch);
            }
        }
        return false;
    });

    return {
        ...data,
        groups,
        students,
        teachers,
        financialRecords,
        warehouseItems,
        meals,
        users,
        parents,
        activities,

        complaints,
        stats: {
            totalStudents: students.length,
            totalGroups: groups.length,
            totalRevenue: financialRecords.filter(r => r.type === 'revenue').reduce((acc, curr) => acc + curr.amount, 0),
            totalStaff: teachers.length,
        },
        currentBranchId: currentBranch
    };
};
