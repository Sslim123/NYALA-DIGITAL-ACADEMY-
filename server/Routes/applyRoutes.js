const express = require('express');
const app= express();
const router = express.Router();
const {applyForm} = require('../controllers/applyController');
const {StudentUpdateStatus, AdminDashboard} = require('../controllers/StudentController');





app.use(express.json());
router.post('/apply',  applyForm );
router.get('/students', AdminDashboard);
router.patch('/students/:id/status', StudentUpdateStatus)



module.exports = router;