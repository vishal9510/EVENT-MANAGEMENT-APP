const Event = require('../model/event.model');
const path = require('path');

// Create Event (Admin)
const createEvent = async (req, res) => {
    const { title, description, location, date, capacity } = req.body;
    try {
        // Check if an image was uploaded
        let imagePath = null;
        if (req.file) {
            imagePath = path.join('/uploads/events', req.file.upload);
        }
        const event = new Event({
            title,
            description,
            location,
            date,
            capacity,
            createdBy: req.user.id,
        });
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// RSVP Event
const rsvpEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.attendees.length >= event.capacity)
            return res.status(400).json({ message: 'Event capacity reached' });

        event.attendees.push(req.user.id);
        await event.save();
        res.status(200).json({ message: 'RSVP successful' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Edit Event (Admin or Event Creator)
const editEvent = async (req, res) => {
    const { title, description, location, date, capacity } = req.body;

    try {
        // Find the event by ID
        const event = await Event.findById(req.params.eventId);

        // Check if the event exists
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if the logged-in user is the creator of the event or an admin
        if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to edit this event' });
        }

        // Update event fields
        event.title = title || event.title;
        event.description = description || event.description;
        event.location = location || event.location;
        event.date = date || event.date;
        event.capacity = capacity || event.capacity;

        // Handle image upload if a new image is uploaded
        if (req.file) {
            event.image = path.join('/uploads/events', req.file.upload);
        }

        // Save the updated event
        await event.save();
        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete Event (Admin or Event Creator)
const deleteEvent = async (req, res) => {
    try {
        // Find the event by ID
        const event = await Event.findById(req.params.eventId);

        // Check if the event exists
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if the logged-in user is the creator of the event or an admin
        if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to delete this event' });
        }

        // Delete the event
        await event.remove();
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    createEvent,
    rsvpEvent,
    editEvent,
    deleteEvent,
};
