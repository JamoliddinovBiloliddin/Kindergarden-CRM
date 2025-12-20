// =========================
// MOCK REPORTS
// =========================
export const mockReports = [
    {
        id: 1,
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        teacherId: 1,
        eating: "good",
        activityNotes:
            "Today we did finger painting and outdoor play. All children enjoyed the activities and were very engaged.",
        sleepTime: "2 hours",
        image: null,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: 2,
        date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
        teacherId: 1,
        eating: "average",
        activityNotes:
            "Story time and music class. Some children were a bit restless but overall good day.",
        sleepTime: "1.5 hours",
        image: null,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
        id: 3,
        date: new Date(Date.now() - 259200000).toISOString().split("T")[0],
        teacherId: 1,
        eating: "good",
        activityNotes:
            "Art and craft day. Children made beautiful collages and showed great creativity.",
        sleepTime: "2.5 hours",
        image: null,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
    },
]

// =========================
// LOAD REPORTS FOR TEACHER
// =========================
export const getReportsByTeacher = teacherId => {
    const reports = JSON.parse(localStorage.getItem("reports") || "[]")
    return reports.filter(r => r.teacherId === teacherId)
}

// =========================
// SAVE REPORT (CREATE)
// =========================
export const saveReport = report => {
    const reports = JSON.parse(localStorage.getItem("reports") || "[]")

    const newReport = {
        ...report,
        id: Date.now(),
        createdAt: new Date().toISOString(),
    }

    reports.push(newReport)
    localStorage.setItem("reports", JSON.stringify(reports))

    return newReport
}

// =========================
// DELETE REPORT
// =========================
export const deleteReport = reportId => {
    const reports = JSON.parse(localStorage.getItem("reports") || "[]")
    const updated = reports.filter(r => r.id !== reportId)

    localStorage.setItem("reports", JSON.stringify(updated))
    return true
}

// =========================
// UPDATE REPORT (CORRECT)
// =========================
export const updateReport = (reportId, updatedData) => {
    const reports = JSON.parse(localStorage.getItem("reports") || "[]")

    const updated = reports.map(r =>
        r.id === reportId ? { ...r, ...updatedData } : r
    )

    localStorage.setItem("reports", JSON.stringify(updated))

    return updated.find(r => r.id === reportId)
}
