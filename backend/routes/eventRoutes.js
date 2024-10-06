const express = require('express');
const { createEvent, rsvpEvent , editEvent, deleteEvent } = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');
const  upload  = require('../middleware/uploadMiddleware');
const router = express.Router();

// Event routes
router.post('/create', protect, admin, upload.single('image'), createEvent); // Only admin can create events
router.post('/:eventId/rsvp', protect, rsvpEvent);   // Users can RSVP for events
router.put('/:eventId/edit', protect, upload.single('image'), editEvent);     // Edit event
router.delete('/:eventId/delete', protect, deleteEvent);                     // Delete event


module.exports = router;
