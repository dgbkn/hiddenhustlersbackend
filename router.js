const express = require('express');
const router = express.Router();
const middlewares = require('./middlewares');
const User = require('./models/User');
const { body, validationResult } = require('express-validator');
const { generateUsername } = require("unique-username-generator");
const ethUtil = require('ethereumjs-util');
const sigUtil = require( 'eth-sig-util');
const jwt = require("jsonwebtoken");
const sercet = process.env.secret;

var Web3 = require('web3');


router.use((err, req, res, next) => {
  res
    .status(err.status||500)
    .send(
      {
        message: err.message,
        success:err.s,
        timestamp: Date.now(),
        path: req.originalUrl
      });
})



router.get('/api/users', async (req, res) => {
  if(req.query.publicAddress && req.query.publicAddress != ""){
    var publicAddress = req.query.publicAddress;
    // cookie = req.cookies;
      const user = await User.findOne({ where: { publicAddress:publicAddress  } });
    
if (user === null) {
 res.json({ success: 'False',error:"User not Found" })
  console.log('Not found!');
} else {
   res.json([user]);
}

  }
  else{
    res.status(401);
    res.json({error:"publicAddress paramater not found,please provide it"}); 
  }

});

router.get("/api/allUsers", async (req, res) => {
  var users = await User.findAll();
  res.json(users);
});

router.post('/api/users/signup', async (req, res) => {
  if(req.body.publicAddress && req.body.publicAddress != ""){
    if(Web3.utils.isAddress(req.body.publicAddress)){
          var publicAddress = req.body.publicAddress;
    // cookie = req.cookies;
      const user = await User.findOne({ where: { publicAddress:publicAddress  } });
    
if (user) {
 res.status(401);
 res.json({ success: 'False',error:"User already exists" })
  // console.log('Not found!');
} else {
  const usr = await User.create({ publicAddress: publicAddress, username: req.body.username ?? generateUsername() });
   res.json(usr);
}
    }else{
          res.status(401);
    res.json({error:"publicAddress paramater not valid,please provide valid paramater"}); 
    }
  }
  else{
    res.status(401);
    res.json({error:"publicAddress paramater not found,please provide it"});
  }

});

router.post('/auth', async (req, res) => {
  if(req.body.publicAddress && req.body.publicAddress != "" && req.body.signature && req.body.signature != ""){
    if(Web3.utils.isAddress(req.body.publicAddress)){
     
//signature verification
var user = User.findOne({ where: { publicAddress:req.body.publicAddress } })
      
      // Step 1: Get the user with the given publicAddress
      
      .then(user => {
        console.log(user.nonce);
        if (!user)
          return res.status(401).send({
            error: `User with publicAddress ${publicAddress} is not found in database`
          });
        return user;
      })
      // Step 2: Verify digital signature
      .then(user => {
        // if (!(user instanceof User)) {
        //   // Should not happen, we should have already sent the response
        //   throw new Error('User is not defined in "Verify digital signature".');
        // }

        const msg = `I am signing my one-time nonce: ${user.nonce}`;
        // We now are in possession of msg, publicAddress and signature. We will use a helper from eth-sig-util to extract the address from the signature
        const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
        const address = sigUtil.recoverPersonalSignature({
          data: msgBufferHex,
          sig: req.body.signature
        });
        // The signature verification is successful if the address found with sigUtil.recoverPersonalSignature matches the initial publicAddress
        if (address.toLowerCase() === user.publicAddress.toLowerCase()) {
          return user;
        } else {
        res
            .status(401)
            .send({ error: 'Signature verification failed' });
        }
      })
      // Step 3: Generate a new nonce for the user
      .then(user => {
        // if (!(user instanceof User)) {
        //   throw new Error(
        //     'User is not defined in "Generate a new nonce for the user".'
        //   );
        // }
        user.nonce = Math.floor(Math.random() * 10000);
        return user.save();
      })
      // Step 4: Create JWT

      .then(user => {
        return new Promise((resolve, reject) =>
          // https://github.com/auth0/node-jsonwebtoken
          jwt.sign(
            {
              payload: {
                id: user.id,
                username:user.username,
                publicAddress:user.publicAddress,
                isProvider:user.isProvider
              }
            },
            process.env.secret,
            {},
            (err, token) => {
              if (err) {
                return reject(err);
              }
              return resolve(token);
            }
          )
        );
      })
      .then(accessToken => res.json({ accessToken }))
  
   
//siignature verification
  
      
    } else{
          res.status(401);
    res.json({error:"publicAddress paramater not valid,please provide valid paramater"}); 
    }
  }
  else{
    res.status(401);
    res.json({error:"publicAddress or signature paramater not found,please provide it"});
  }
});


router.get('/logout', (req, res) => {
  //console.log('Cookies: ', req.cookies);
  // res.send('');
    cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }    
        res.cookie(prop, '', {expires: new Date(0)});
    }
    res.redirect('/');
});


router.get('/',
async (req, res,next) => {
  // const users = await User.findAll();
  // res.send(users);
  res.send("Backend Server Successfully Running");
 // next(new middlewares.Running());
  // res.render('index.ejs');
}
);

module.exports = router;