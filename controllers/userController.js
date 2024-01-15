const PROP_SCHEDULES = require('./Models/propSchedules');
const PROPS = require('./Models/propSchema');
const ObjectId = require('mongoose').Types.ObjectId;

const getMyBookingsData = (req,res) => {
    const currentDate = new Date();
    const slotHour = currentDate.getHours();
    currentDate.setUTCHours(0,0,0,0)

    PROP_SCHEDULES.aggregate([
        {
        $match: {
            bookedBy: new ObjectId(req.userId),
            $expr: {
                $or: [
                    { $gt:["$date",currentDate] },
                    {
                    $and:[
                        { $eq:["$date",currentDate] },
                        { $gte:["$slot.id",slotHour] },
                    ],
                    },
                ],
            },
        },
        },
       {
        $lookup: {
            from: 'properties',
            localField:'propId',
            foreignField:'_id',
            as:'properties'
        }
       },       
        //output will be array like $properties = ({})
       {
        $project: {
            _id:1,
            date:1,
            slot:1,
            propData:{$arrayElemAt:['$properties',0]}
        }
       }
    ]).then((response)=>{
        console.log(response);
        res.status(200).json(response);
    }).catch((error)=>{
        console.log(error);
    })
};



module.exports = {getMyBookingsData}