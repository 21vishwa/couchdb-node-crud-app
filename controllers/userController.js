const db = require("../db");

exports.getUsers = async (req,res)=>{
  const result = await db.list({include_docs:true});
  res.json(result.rows.map(r=>r.doc));
};

exports.getUser = async (req,res)=>{
  res.json(await db.get(req.params.id));
};

exports.updateUser = async (req,res)=>{
  const user = await db.get(req.params.id);
  await db.insert({...user,...req.body});
  res.json({message:"Updated"});
};

exports.deleteUser = async (req,res)=>{
  const user = await db.get(req.params.id);
  await db.destroy(user._id,user._rev);
  res.json({message:"Deleted"});
};
