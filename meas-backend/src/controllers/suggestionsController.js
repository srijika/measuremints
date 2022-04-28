const db = require('../db/conn');
const {Sugggestions} = db;
const mongoose = require("mongoose");


module.exports = {

    sendSuggestion: async (req, res ) => {
        try {
            const {
                sender_email,
                suggestion,
            } = req.body;

            if (!sender_email)
                return res.send({
                    status: 400,
                    message: "Sender email is required"
                });
            if (!suggestion)
                return res.send({
                    status: 400,
                    message: "Suggestion is required"
                });

            let suggestionData = {
                sender_email: sender_email,
                suggestion: suggestion,
            };

            const sendSuggestionData = await Sugggestions(suggestionData).save();

            return res.send({
                status: 200,
                SuggestionData: sendSuggestionData,
                message: 'Suggestion Sent Successfully'
            });


        } catch (error) {

            return res.send({
                status: 400,
                message: error.message
            })
        }
    },

    getAllSuggestions : async ( req, res) => {
        try {
            
            const allSuggestion = await Sugggestions.find();

            return res.send({
                status: 200,
                SuggestionData: allSuggestion,
            });


        } catch (error) {

            return res.send({
                status: 400,
                message: error.message
            })
        }
    }
   
}
