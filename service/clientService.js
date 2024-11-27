// create a class for name clientService with the details of  name, email, phone, age, goal, coachId
const nodemailer = require('nodemailer');
const cron = require('node-cron');

class ClientService {
    constructor(clientModel) {
        this.clientModel = clientModel;
        this.transporter = nodemailer.createTransport({
            // Configure your email service here
            service: 'gmail',
            secure: true,
            port: 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async createClient(req) {
        const { name, email, phone, age, goal, coachId } = req.body;
        const client = await this.clientModel.findOne({ email: email });
        if (client) {
            throw new Error("Client already exists");
        }
        const newClient = new this.clientModel({
            name,
            email,
            phone,
            age,
            goal,
            coachId
        });
        // console.log(newClient, req.user)
        await newClient.save();
        return {
            status: 201,
            client: newClient,
            message: "Client created successfully",
        };
    };


    async getAllClients() {
        const clients = await this.clientModel.find();
        return {
            status: 200,
            clients,
            message: "Clients fetched successfully",
        };
    };


    async updateClientDetails(req) {
        const { id } = req.params;
        const { name, email, phone, age, goal, progress, weight, bmi, lastUpdated } = req.body;
        const client = await this.clientModel.findById(id);
        if (!client) {
            throw new Error("Client not found");
        }
        // console.log(req.user.id)

        const isCoachMatch = client && client.coachId == req.user.id
        // console.log(isCoachMatch)
        if (!isCoachMatch) {
            throw new Error("Your are trying to update someone else's client details");
        }

        const updateClientDetails = await this.clientModel.findByIdAndUpdate(id, {
            name,
            email,
            phone,
            age,
            goal,
            progress,
            weight,
            bmi,
            lastUpdated: Date.now()
        }, { runValidators: true, new: true });

        return {
            status: 200,
            updateClientDetails,
            message: "Client details updated successfully",
        }
    }


    async deleteClient(req) {
        const { id } = req.params;
        const client = await this.clientModel.findById(id);
        if (!client) {
            throw new Error("Client not found");
        }
        await this.clientModel.findByIdAndDelete(id);
        return {
            status: 200,
            message: "Client deleted successfully"
        }
    }


    async scheduleFollowUp(clientId, scheduleData) {
        const { date, time, sessionType } = scheduleData;
        const client = await this.clientModel.findById(clientId);

        if (!client) {
            throw new Error("Client not found");
        }

        // Create the follow-up session
        const followUpSession = {
            date,
            time,
            sessionType,
            status: 'scheduled'
        };

        // Add to client's sessions array
        client.sessions = client.sessions || [];
        client.sessions.push(followUpSession);
        await client.save();

        // Send immediate email notification
        await this.sendSessionNotification(client.email, followUpSession);

        // Schedule reminder for 24 hours before
        this.scheduleReminder(client.email, followUpSession);

        return {
            status: 200,
            message: "Follow-up session scheduled successfully",
            session: followUpSession
        };
    }

    async sendSessionNotification(email, session) {
        const emailContent = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `New Session Scheduled: ${session.sessionType}`,
            text: `Your ${session.sessionType} session has been scheduled for ${session.date} at ${session.time}.`
        };

        await this.transporter.sendMail(emailContent);
    }

    scheduleReminder(email, session) {
        const sessionDate = new Date(`${session.date} ${session.time}`);
        const reminderDate = new Date(sessionDate.getTime() - 24 * 60 * 60 * 1000); // 24 hours before session

        const delay = reminderDate.getTime() - Date.now(); // Calculate delay in milliseconds

        if (delay > 0) {
            setTimeout(async () => {
                const reminderEmail = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: `Reminder: ${session.sessionType} Tomorrow`,
                    text: `Reminder: Your ${session.sessionType} session is scheduled for tomorrow at ${session.time}.`
                };

                try {
                    await this.transporter.sendMail(reminderEmail);
                    console.log(`Reminder email sent to ${email}`);
                } catch (error) {
                    console.error(`Failed to send reminder email: ${error.message}`);
                }
            }, delay);
        } else {
            console.error("Reminder date is in the past. Skipping scheduling.");
        }
    }



}

module.exports = ClientService;