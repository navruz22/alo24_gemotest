const axios = require('axios');
const config = require("config")
const { Clinica } = require('../../models/DirectorAndClinica/Clinica')
const { OfflineConnector } = require('../../models/OfflineClient/OfflineConnector')
const { StatsionarClient } = require('../../models/StatsionarClient/StatsionarClient')
require('../../models/OfflineClient/OfflineClient')
require('../../models/StatsionarClient/StatsionarClient')


const handleSend = async (smsKey, number, message) => {
    return axios.get(`https://smsapp.uz/new/services/send.php?key=${smsKey}&number=${number}&message=${message}`)
        .then(res => {
            return res
        })
        .catch(err => {
            console.log('Error: ', err.message);
            return err
        });
}




module.exports.sendMessage = async (req, res) => {
    try {

        const { connectorId, clientId } = req.body;

        let connector = {}

        if (String(clientId).toLocaleLowerCase().includes('s')) {
            connector = await StatsionarClient.findById(connectorId)
                .select("-__v -isArchive -updatedAt")
                .populate('client')
                .populate('clinica')

            // connector.isSended = true;
            // await connector.save()
        } else {
            connector = await OfflineConnector.findById(connectorId)
                .select("-__v -isArchive -updatedAt")
                .populate('client')
                .populate('clinica')
            // connector.isSended = true;
            // await connector.save()
        }



        if (connector.clinica.smsKey) {
            handleSend(connector.clinica.smsKey, `998${connector.client.phone}`, `Xurmatli ${connector.client.firstname} ${connector.client.lastname} sizning ${connector.clinica.name} ga topshirgan tahlil natijalaringiz tayyor! Yuklab olish: ${config.get('baseUrl')}/clienthistory/${connector._id}`).then(async (data) => {
                // console.log(data);
                connector.isSended = true;
                await connector.save()

            })
        }
        res.status(200).json({ message: 'Xabar yetkazildi!' })
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}
