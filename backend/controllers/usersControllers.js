const mongoose = require("mongoose");
const UsersCollection = mongoose.model("user");
const queryHelper = require('../helpers/query');

class usersController {
    async userRegister (req,res) {
        try {
            let bData = req.body
            let addUsers = await queryHelper.insertData(UsersCollection,bData)
            if(addUsers.status){
                res.send({status:addUsers.status,data:addUsers.msg,message:"User added successfully..."})
            }else{
                res.send({status:addUsers.status,message:addUsers.msg})
            }
        } catch (error) {
            console.log("userRegister error",error);
        }
    }
}

module.exports = new usersController();