import Event from '../models/eventModel.js';
import { parse, format } from 'date-fns';
// import { utcToZonedTime, format } from 'date-fns-tz';

// Helper function to format dates based on timezone
const formatDateInTimezone = (date, timeZone) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };
  
  export const getEvents = async (req, res) => {
    try {
      const events = await Event.find();
  
      // Format dates for output
      const formattedEvents = events.map(event => ({
        ...event.toObject(),
        date: format(new Date(event.date), 'MM/dd/yyyy'), // Adjust format as needed
      }));
  
      res.json(formattedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      res.status(500).json({ message: 'Error fetching events', error: err.message });
    }
  };


export const addEvent = async (req, res) => {
    const { title, date, category } = req.body;
  
    // Parse the date string to a Date object
    const parsedDate = parse(date, 'MM/dd/yyyy', new Date());
  
    const event = new Event({
      title,
      date: parsedDate,
      category,
    });
  
    try {
      const newEvent = await event.save();
  
      // Format the date for output
      const formattedEvent = {
        ...newEvent.toObject(),
        date: format(newEvent.date, 'MM/dd/yyyy'), // Adjust format as needed
      };
  
      res.status(201).json(formattedEvent);
    } catch (err) {
      console.error('Error saving event:', err);
      res.status(400).json({ message: err.message });
    }
  };
  
  export const updateEvent = async (req, res) => {
    const { title, date, category } = req.body;
  
    // Convert date to Date object if provided
    const updatedData = {
      title,
      ...(date && { date: parse(date, 'MM/dd/yyyy', new Date()) }),
      category,
    };
  
    try {
      const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updatedData, { new: true });
  
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      // Format the date for output
      const formattedEvent = {
        ...updatedEvent.toObject(),
        date: format(new Date(updatedEvent.date), 'MM/dd/yyyy'), // Adjust format as needed
      };
  
      res.json(formattedEvent);
    } catch (err) {
      console.error('Error updating event:', err);
      res.status(400).json({ message: err.message });
    }
  };

  export const deleteEvent = async (req, res) => {
    try {
      const deletedEvent = await Event.findByIdAndDelete(req.params.id);
  
      if (!deletedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      res.json({ message: 'Event deleted' });
    } catch (err) {
      console.error('Error deleting event:', err);
      res.status(500).json({ message: 'Error deleting event', error: err.message });
    }
  };
