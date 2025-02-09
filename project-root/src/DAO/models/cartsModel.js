
import mongoose from 'mongoose';

export const cartsModel=mongoose.model(
    'Cart',
    new mongoose.Schema(
        {
        products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
        ]
    },
    {
        timestamps: true
    }
    )
);  
