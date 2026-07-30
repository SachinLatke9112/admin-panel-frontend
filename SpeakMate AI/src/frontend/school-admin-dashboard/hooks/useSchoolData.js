import { useState, useMemo } from "react";

const initialStudents = [
    { id: "stu-1", name: "Aarav Patel", email: "aarav.patel@school.edu", standard: 10, rollNo: "10A01", status: "active", joinedAt: "2025-06-12" },
    { id: "stu-2", name: "Diya Sharma", email: "diya.sharma@school.edu", standard: 9, rollNo: "9B14", status: "active", joinedAt: "2025-06-15" },
    { id: "stu-3", name: "Kiran Singh", email: "kiran.singh@school.edu", standard: 10, rollNo: "10A07", status: "inactive", joinedAt: "2025-07-01" },
    { id: "stu-4", name: "Meera Nair", email: "meera.nair@school.edu", standard: 8, rollNo: "8C03", status: "active", joinedAt: "2025-07-10" },
    { id: "stu-5", name: "Rohan Gupta", email: "rohan.gupta@school.edu", standard: 9, rollNo: "9B22", status: "active", joinedAt: "2025-08-05" },
];

export function useStudents(initial = initialStudents) {
    const [students, setStudents] = useState(initial);
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return students;
        return students.filter(
            (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q)
        );
    }, [students, searchTerm]);

    const addStudent = (data) => {
        const newStudent = { ...data, id: `stu-${Date.now()}`, joinedAt: new Date().toISOString().slice(0, 10) };
        setStudents((prev) => [newStudent, ...prev]);
    };

    const updateStudent = (id, data) => {
        setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    };

    const deleteStudent = (id) => {
        setStudents((prev) => prev.filter((s) => s.id !== id));
    };

    return { students: filtered, totalStudents: students.length, searchTerm, setSearchTerm, addStudent, updateStudent, deleteStudent };
}

const initialResults = [
    { id: "res-1", studentName: "Aarav Patel", standard: 10, testTitle: "English Grammar Basics", marksObtained: 42, totalMarks: 50, percentage: 84, status: "Passed", submittedAt: "2026-06-15" },
    { id: "res-2", studentName: "Diya Sharma", standard: 9, testTitle: "Mathematics — Algebra", marksObtained: 88, totalMarks: 100, percentage: 88, status: "Passed", submittedAt: "2026-06-22" },
    { id: "res-3", studentName: "Kiran Singh", standard: 10, testTitle: "English Grammar Basics", marksObtained: 28, totalMarks: 50, percentage: 56, status: "Passed", submittedAt: "2026-06-16" },
    { id: "res-4", studentName: "Meera Nair", standard: 8, testTitle: "Social Studies — History", marksObtained: 65, totalMarks: 70, percentage: 93, status: "Passed", submittedAt: "2026-07-12" },
    { id: "res-5", studentName: "Rohan Gupta", standard: 9, testTitle: "Mathematics — Algebra", marksObtained: 45, totalMarks: 100, percentage: 45, status: "Failed", submittedAt: "2026-06-23" },
];

export function useResults(initial = initialResults) {
    const [results, setResults] = useState(initial);
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return results;
        return results.filter((r) => r.studentName.toLowerCase().includes(q) || r.testTitle.toLowerCase().includes(q));
    }, [results, searchTerm]);

    const addResult = (data) => {
        const newResult = { ...data, id: `res-${Date.now()}`, percentage: Math.round((data.marksObtained / data.totalMarks) * 100) };
        setResults((prev) => [newResult, ...prev]);
    };

    const updateResult = (id, data) => {
        setResults((prev) => prev.map((r) => (r.id === id ? { ...r, ...data, percentage: data.marksObtained && data.totalMarks ? Math.round((data.marksObtained / data.totalMarks) * 100) : r.percentage } : r)));
    };

    const deleteResult = (id) => {
        setResults((prev) => prev.filter((r) => r.id !== id));
    };

    return { results: filtered, totalResults: results.length, searchTerm, setSearchTerm, addResult, updateResult, deleteResult };
}
