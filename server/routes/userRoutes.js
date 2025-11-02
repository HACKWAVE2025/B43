import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { authorizedRoles } from '../middlewares/roleMiddleware.js';
import { saveSurvey, getSurvey } from '../controllers/userController.js';

const router = express.Router();

// Only admin can access this test route
router.get('/admin', verifyToken, authorizedRoles("admin"), (req, res) => {
    res.json({ message: 'Admin route accessed' });
})

// Only users can access this test route
router.get('/user', verifyToken, authorizedRoles("admin","user"),(req, res) => {
    res.json({ message: 'User route accessed' });
})

// Get survey/profile inputs for the logged-in user
router.get('/survey', verifyToken, getSurvey);

// Save survey/profile inputs from frontend for the logged-in user
router.post('/survey', verifyToken, saveSurvey);

export default router;