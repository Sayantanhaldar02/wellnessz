const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    time: { type: String, required: true },
    sessionType: { type: String, required: true, enum: ['Consultation', 'Follow-up'] },
    status: { type: String, default: 'scheduled', enum: ['scheduled', 'completed', 'cancelled'] },
    createdAt: { type: Date, default: Date.now }
});

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    age: { type: Number },
    goal: { type: String },
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    progress: { type: String },
    weight: { type: Number },
    bmi: { type: Number },
    lastUpdated: { type: Date, default: Date.now },
    sessions: [sessionSchema]
});

const ClientModel = mongoose.model('Client', clientSchema);

module.exports = ClientModel;