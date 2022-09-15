const express = require('express');
const router = express.Router();
const conn = require('./db');
const util = require('util');
let query = util.promisify(conn.query).bind(conn);
const haversineDistance= require('./haversine')
// Have used the cache instead of MySQL as it will be much faster in case of production. We can use in memory db to maintain 
//the cache like redis.

// Currently assuming that the request is coming from same user everytime.
// input should be like
// {
//     "latitude": 28.633038195328755, 
//     "longitude":  77.21969570513404
// }

let cache = [];
router.post('/trackSteps', async function(req,res){
    try {
        let lastElement;
        let lenOfOneStep = 0.75;
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;
        if(cache && cache.length) {
            lastElement = cache[cache.length - 1];
        } else {
            cache.push({latitude: latitude, longitude: longitude, distance: 0})
            return res.send(JSON.stringify({"Steps": 0,"success": true, }))
        }
        let a = {};
        a["latitude"] = lastElement.latitude;
        a["longitude"] = lastElement.longitude;
        const b = { latitude: latitude, longitude: longitude}
        let x = haversineDistance(a,b)
        let currentDistance = lastElement["distance"] + x;
        cache.push({latitude: latitude, longitude: longitude, distance: currentDistance})
        let totalSteps = currentDistance/lenOfOneStep
        totalSteps = Math.round(totalSteps)
        res.send(JSON.stringify({"Steps": totalSteps,"success": true}))
    } 
    catch(e){
        res.send(JSON.stringify({"success": false}))
    }
    
})

router.post('/login', async function(req, res){
    try{
        const mobileNo = req.body.mobileNo;
        const ifUserExistQuery = `SELECT id FROM userinfo WHERE mobile = ?`
        let userExists = await query(ifUserExistQuery, [mobileNo]);
        if(!userExists.length) {
            res.redirect('/signup')
        } else {
            res.redirect('/dashboard')
        }
    }
    catch(e){
        res.send(JSON.stringify({"success": false}))
    }
    
})

module.exports = router;