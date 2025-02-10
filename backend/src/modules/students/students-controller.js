const asyncHandler = require("express-async-handler");
const { validationResult, check } = require("express-validator");
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
    try {
        const students = await getAllStudents(req.query);
        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve students"
        });
    }
});

/**
 * @desc    Add a new student
 * @route   POST /api/v1/students
 * @access  Public
 */
const handleAddStudent = [
    check("name").trim().notEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Valid email is required"),
    check("dob").optional().isDate().withMessage("Invalid date of birth"),
    check("phone").optional().isNumeric().withMessage("Phone number must be numeric"),
    check("class").optional().isString().withMessage("Class must be a string"),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const student = await addNewStudent(req.body);
            res.status(201).json({
                success: true,
                message: "Student added successfully",
                data: student
            });
        } catch (error) {
            console.error("Error adding student:", error);
            res.status(500).json({
                success: false,
                message: "Failed to add student"
            });
        }
    })
];

/**
 * @desc    Update student details
 * @route   PUT /api/v1/students/:id
 * @access  Public
 */
const handleUpdateStudent = [
    check("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    check("email").optional().isEmail().withMessage("Valid email is required"),
    check("dob").optional().isDate().withMessage("Invalid date of birth"),
    check("phone").optional().isNumeric().withMessage("Phone number must be numeric"),
    check("class").optional().isString().withMessage("Class must be a string"),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const { id } = req.params;
            const updatedStudent = await updateStudent(id, req.body);

            if (!updatedStudent) {
                return res.status(404).json({ success: false, message: "Student not found" });
            }

            res.status(200).json({
                success: true,
                message: "Student updated successfully",
                data: updatedStudent
            });
        } catch (error) {
            console.error("Error updating student:", error);
            res.status(500).json({
                success: false,
                message: "Failed to update student"
            });
        }
    })
];

/**
 * @desc    Get student details by ID
 * @route   GET /api/v1/students/:id
 * @access  Public
 */
const handleGetStudentDetail = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const student = await getStudentDetail(id);

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error("Error fetching student details:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve student details"
        });
    }
});

/**
 * @desc    Change student status (active/inactive)
 * @route   POST /api/v1/students/:id/status
 * @access  Public
 */
const handleStudentStatus = [
    check("status").isBoolean().withMessage("Status must be true or false"),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const { id } = req.params;
            const { status } = req.body;
            const updatedStatus = await setStudentStatus(id, status);

            if (!updatedStatus) {
                return res.status(404).json({ success: false, message: "Student not found" });
            }

            res.status(200).json({
                success: true,
                message: "Student status updated successfully",
                data: updatedStatus
            });
        } catch (error) {
            console.error("Error updating student status:", error);
            res.status(500).json({
                success: false,
                message: "Failed to update student status"
            });
        }
    })
];

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent
};
