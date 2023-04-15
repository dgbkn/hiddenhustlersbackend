const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const secret = process.env.secret;

//user get Error Handeling
module.exports = {

InvalidIdException: function InvalidIdException(){
  this.status = 400;
  this.s = false;
  this.message = 'Invalid ID';
},

CustomExpection: function CustomExpection(msg ='error'){
  this.status = 400;
  this.s = false;
  this.message = msg;
},

NotFoundException: function NotFoundException(){
  this.status = 404;
    this.s = false;

  this.message = 'Requested Content was not found';
},

Updated: function Updated(){
  this.status = 200;
    this.s = true;

  this.message = 'Requested Content was Updated';
},

Deleted: function Deleted(){
  this.status = 200;
  this.s = true;
  this.message = 'Requested Content was deleted';
},

Inserted: function Inserted(){
  this.status = 200;
  this.s = true;
  this.message = 'Requested Content was Inserted';
},

InvalidToken: function InvalidToken(){
  this.status = 400;
   this.s = false;
  this.message = 'Token Mismatch';
},

Running: function Running(){
  this.status = 200;
   this.s = true;
  this.message = 'Server is up and running';
},





//middle wares
 idNumberControl : function idNumberControl(req, res, next){
  const id = Number.parseInt(req.params.id);
  if (Number.isNaN(id)) {
    throw new InvalidIdException();
  }
  next();
},



//middle wares
 checkAuth :async function checkAuth(req, res, next){
   
 const auth = req.headers['Authorization'];
 if(!auth){
    // throw new InvalidToken();
    res.status(401);
   res.json({error:"Invalid Token Used"});
 }else{
   try{
     var decoded = jwt.verify(auth, secret);
   const user = await User.findOne({ where: { publicAddress:decoded.publicAddress,id:decoded.id  } });
     
   }catch(e){
    res.status(401);
   res.json({error:"Error:" + e.message});
   }
    if(user){
           next();
     }else{
    res.status(401);
   res.json({error:"Invalid Token Used"});
  }
 }

},



pagination: function pagination(req, res, next) {

  const pageAsNumber = Number.parseInt(req.query.page);
  const sizeAsNumber = Number.parseInt(req.query.size);

  let page = 0;
  if(!Number.isNaN(pageAsNumber) && pageAsNumber > 1){
    page = pageAsNumber - 1;
  }

  let size = 10;
  if(!Number.isNaN(sizeAsNumber) && !(sizeAsNumber > 10) && !(sizeAsNumber < 1)){
    size = sizeAsNumber;
  }


  req.pagination = {
    page, size
  }
  next();
}
//middle wares

};