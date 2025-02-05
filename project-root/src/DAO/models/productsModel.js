
import mongoose from 'mongoose';

export default mongoose.model(
    'Product',
    new mongoose.Schema(
        {
            name: { type: String, required: true },
            code: { type: String, required: true, unique: true },
            description: { type: String, required: true },
            price: { type: Number, required: true },
            stock: { type: Number, required: true, min: 0 }
        },
        {
            timestamps: true
        }
    )
);  

