// get users

import userCollection from "../models/userModel.js"

export const getAllUsers =async (req,res)=> {
    const user = await userCollection.get();
    let users = []
    user.forEach((doc)=> {
        users.push({id :doc.id , ...doc.data()})
    })
    res.status(200).json({users})
}
// get users by Id

export const getUserById =async (req,res)=> {
    const userId = req.params.id;
    const user = await userCollection.doc(userId).get();
    res.status(200).json({user :user.data()})
}
// update users

export const udatedUser =async (req,res)=> {
    const userId = req.params.id;
    const updatedUser = req.body
    await userCollection.doc(userId).update(updatedUser)
    const user=  await userCollection.doc(userId).get()
    res.status(200).json({messsage:'updated', user: user.data()})
}
// Delet users

export const deleteUser =async (req,res)=> {
    const userId = req.params.id;
    await userCollection.doc(userId).delete()
    res.status(200).json({messsage:'userDeleted'})
}
