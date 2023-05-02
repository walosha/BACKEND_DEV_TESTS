import mongoose, { Document, Model, Schema, model } from 'mongoose';

interface AccountAttrs {
  id: string;
  user: string;
  accountType: any;
  balance: number;
}

interface IAccount extends Document {
  id: string;
  user: string;
  accountType: any;
  balance: number;
}

export interface AccountModel extends Model<IAccount> {
  build(attrs: AccountAttrs): IAccount;
}

const AccountSchema = new Schema({
  accountType: {
    type: String,
    enum: ['Savings', 'Current', 'BasicSavings'],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  balance: {
    type: Number,
    default: 0,
  },
});

AccountSchema.methods.verifyBalance = function (amountToAdd: any) {
  if (this.accountType === 'BasicSavings' && this.balance + amountToAdd > 50000) {
    return false;
  }
  return true;
};

AccountSchema.statics.build = (attrs: AccountAttrs) => {
  return new Account(attrs);
};

const Account = model<IAccount, AccountModel>('Account', AccountSchema);
export default Account;
