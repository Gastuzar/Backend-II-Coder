
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


export default mongoose.model(
    'Ticket',
    new mongoose.Schema(
        {
            code: { type: String, unique: true, default: uuidv4 }, 
            purchase_datetime: { type: Date, default: Date.now }, 
            amount: { type: Number, required: true }, 
            purchaser: { type: String, required: true } 
        },
        {
            timestamps: true
        }
    )    
);