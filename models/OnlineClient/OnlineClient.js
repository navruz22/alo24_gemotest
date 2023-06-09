const {Schema, model, Types} = require('mongoose')
const Joi = require('joi')

const client = new Schema(
    {
        clinica: {type: Schema.Types.ObjectId, ref: 'Clinica'},
        isArchive: {type: Boolean, default: false},
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        fathername: {type: String},
        fullname: {type: String},
        born: {type: Date},
        gender: {type: String, required: true},
        phone: {type: String, required: true},
        address: {type: String},
        connectors: [{type: Schema.Types.ObjectId, ref: 'OnlineConnector'}],
        reseption: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        national: {type: String, required: true},
        id: {type: Number},
    },
    {
        timestamps: true,
    },
)

function validateClient(client) {
    const schema = Joi.object({
        clinica: Joi.string(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        fathername: Joi.string(),
        gender: Joi.string(),
        born: Joi.date(),
        phone: Joi.string(),
        address: Joi.string(),
        connectors: Joi.string(),
        reseption: Joi.string().required(),
        national: Joi.string()
    })

    return schema.validate(client)
}

module.exports.validateOnlineClient = validateClient
module.exports.OnlineClient = model('OnlineClient', client)
