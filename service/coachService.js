const bcrypt = require('bcrypt');
const ClientModel = require('../models/client.model');
class CoachService{
    constructor(coachModel){
        this.coachModel = coachModel;
    }

    async createCoach(req){
        const { name, email, password, role, specialization } = req.body;
        const coach = await this.coachModel.findOne({ email: email });
        // console.log(coach)
        if (coach) {
            throw new Error("Coach already exists");
        }   
        const hashedPassword = await bcrypt.hash(password, 10);

        const newCoach = new this.coachModel({
            name,
            email,
            password: hashedPassword,
            role:"coach",
            specialization
        }); 
        await newCoach.save();
        return {
            status: 201,
            coach: newCoach,
            message: "Coach created successfully"
        }
    };

    async getAllCoaches(){
        const coaches = await this.coachModel.find({ role: "coach" });
        return {
            status: 200,
            coaches,
            message: "Coaches fetched successfully"
        }
    }

    async getClientsByCoachId(req) {
        const { coachId } = req.params;
        // console.log(coachId)
        const clients = await ClientModel.find({ coachId: coachId });
        // console.log(clients)
        return {
            status: 200,
            clients,
            message: "Clients fetched successfully",
        };
    };

}

module.exports = CoachService;