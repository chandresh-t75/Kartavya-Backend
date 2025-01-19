import mongoose from "mongoose";
import Payment from "../models/payment.model.js";
import { v4 as uuidv4 } from 'uuid';


export const createPayment = async (req, res) => {
    try {
      const { amount, note,campaignId, upiId, payerName } = req.body;
  
      if (!amount || !upiId || !payerName || !campaignId) {
        return res.status(400).json({
          status: 'error',
          message: 'Amount, UPI ID, and Payer Name are required',
        });
      }
      const transactionId = uuidv4();
  
      const paymentDetails = new Payment({
        transactionId,
        upiId,
        payerName,
        campaignId,
        amount,
        note,
      });
  
      // Save to the database
      await paymentDetails.save();
  
      // Construct UPI payment URL
      const upiUrl = `upi://pay?pa=${upiId}&pn=${payerName}&am=${amount}&mc=""&cu=INR&tn=${note}&tr=${transactionId}`;
  
      res.status(200).json({
        transactionId,
        upiUrl,
        message: 'Payment initiated. Use the UPI link to complete the transaction.',
      });
    } catch (error) {
      console.error('Error initiating payment:', error);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while initiating payment.',
      });
    }
  };
  

  export const verifyPayment =async (req, res) => {
    try {
      const { transactionId } = req.body;
  
      if (!transactionId) {
        return res.status(400).json({
          status: 'error',
          message: 'Transaction ID is required',
        });
      }
  
      // Find the transaction in the database
      const transaction = await Payment.findOne({ transactionId });
  
      if (!transaction) {
        return res.status(404).json({
          status: 'error',
          message: 'Transaction not found',
        });
      }
  
      
      if (transaction.status === 'pending') {
        transaction.status = 'success'; 
        await transaction.save();
      }
  
      res.status(200).json({
        transactionId: transaction.transactionId,
        status: transaction.status,
        message: `Payment ${transaction.status === 'success' ? 'verified' : 'pending'}`,
      });
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({
        status: 'error',
        message: 'An error occurred while verifying payment.',
      });
    }
  };