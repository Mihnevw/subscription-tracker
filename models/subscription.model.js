import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxLength: [100, 'Name cannot exceed 100 characters'],
        minLength: [3, 'Name must be at least 3 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        maxLength: [1000, 'Price must be less than 1000'],
        minLength: [0, 'Price must be greater than 0']
    },
    currrency: {
        type: String,
        enum: ['USE', 'EUR', 'GBP'],
        default: 'USD',
        required: [true, 'Currency is required'],
        trim: true,
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        default: 'monthly',
    },
    category: {
        type: String,
        enum: ['entertainment', 'food', 'health', 'services', 'shopping', 'transport'],
        required: [true, 'Category is required'],
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required'],
        enum: ['cash', 'credit card', 'debit card', 'paypal'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'paused'],
        default: 'active',
    },

    //Тук валидираме свойствата на данните преди да бъдат въведени
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        validate: {
            validator: (value) => value < new Date(),
            message: 'Start date must be in the past',
        }
    },
    renewalDate: {
        type: Date,
        required: [true, 'Start date is required'],
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after the start date',
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        index: true,
    }
}, { timestamps: true });

//Автоматично ще изчисти датата на подновяване ако липсва такава
subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        this.renewalDate = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        }

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + this.renewalDate[this.frequency]);
    }

    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }

    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;