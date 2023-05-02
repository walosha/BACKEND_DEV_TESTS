import { Request, Response } from 'express';
import Account from '../model';

export const transferFund = async (req: Request, res: Response) => {
  const { fromAccountId, toAccountId, amount } = req.body;
  try {
    let srcAccount: any = await Account.findById(fromAccountId);
    let destAccount: any = await Account.findById(toAccountId);

    if (String(srcAccount.user) == String(destAccount.user)) {
      return res.status(400).json({
        error: 'Cannot transfer to own acccount',
        errorCode: 400,
      });
    }
    if (srcAccount.balance >= amount) {
      srcAccount = await Account.findByIdAndUpdate(
        srcAccount,
        {
          $inc: {
            balance: -amount,
          },
        },
        { returnOriginal: false },
      );

      destAccount = await Account.findByIdAndUpdate(destAccount, {
        $inc: {
          balance: amount,
        },
      });
      console.log('srcAcc', srcAccount);

      const destUserId = destAccount.user;
      const destUserData = await Account.aggregate([
        {
          $match: {
            user: destUserId,
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$balance',
            },
          },
        },
      ]);
      console.log(destUserData[0].total);

      return res.json({
        newSrcBalance: srcAccount.balance,
        totalDestBalance: destUserData[0].total,
        transferedAt: new Date(),
      });
    } else {
      return res.status(400).json({
        error: 'Not enough balance',
        errorCode: 400,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: 'Transcation failed',
    });
  }
};
