const asyncHandler = require("express-async-handler");
const { 
    getAllStudents, 
    addNewStudent, 
    getStudentDetail, 
    setStudentStatus, 
    updateStudent 
} = require("./students-service");

/**
 * @desc    Get all students with optional filters
 * @route   GET /api/v1/students
 * @access  Public
 */
const handleGetAllStudents = asyncHandler(async (req, res) => {
    const students = await getAllStudents(req.query);
    res.json({ students });
});

/**
 * @desc    Get student details by ID
 * @route   GET /api/v1/students/:id
 * @access  Public
 */
const handleGetStudentDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const student = await getStudentDetail(id);
    res.json(student);
});

/**
 * @desc    Add a new student
 * @route   POST /api/v1/students
 * @access  Public
 */
const handleAddStudent = asyncHandler(async (req, res) => {
    const payload = req.body;
    const message = await addNewStudent(payload);
    res.json(message);
});

/**
 * @desc    Update student details
 * @route   PUT /api/v1/students/:id
 * @access  Public
 */
const handleUpdateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, ...otherDetails } = req.body;
    // Combine the student ID from URL params with the rest of the update payload
    const payload = { id, name, email, ...otherDetails };
    const message = await updateStudent(payload);
    res.json(message);
});

/**
 * @desc    Change student status (active/inactive)
 * @route   POST /api/v1/students/:id/status
 * @access  Public
 */
const handleStudentStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reviewerId, status } = req.body;
    const message = await setStudentStatus({ userId: id, reviewerId, status });
    res.json(message);
});

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
};
