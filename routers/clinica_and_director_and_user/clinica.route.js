const { Adver } = require('../../models/Adver/Adver')
const { OfflineDiscount } = require('../../models/Cashier/OfflineDiscount')
const { OfflinePayment } = require('../../models/Cashier/OfflinePayment')
const { StatsionarDiscount } = require('../../models/Cashier/StatsionarDiscount')
const { StatsionarPayment } = require('../../models/Cashier/StatsionarPayment')
const { StatsionarPrePayment } = require('../../models/Cashier/StatsionarPrePayment')
const { CounterDoctor } = require('../../models/CounterDoctor/CounterDoctor')
const {
  Clinica,
  validateClinica,
} = require('../../models/DirectorAndClinica/Clinica')
const { Director } = require('../../models/DirectorAndClinica/Director')
const { OfflineAdver } = require('../../models/OfflineClient/OfflineAdver')
const { OfflineClient } = require('../../models/OfflineClient/OfflineClient')
const { OfflineConnector } = require('../../models/OfflineClient/OfflineConnector')
const { OfflineCounteragent } = require('../../models/OfflineClient/OfflineCounteragent')
const { OfflineProduct } = require('../../models/OfflineClient/OfflineProduct')
const { OfflineService } = require('../../models/OfflineClient/OfflineService')
const { OnlineAdver } = require('../../models/OnlineClient/OnlineAdver')
const { OnlineClient } = require('../../models/OnlineClient/OnlineClient')
const { OnlineConnector } = require('../../models/OnlineClient/OnlineConnector')
const { OnlineCounteragent } = require('../../models/OnlineClient/OnlineCounteragent')
const { OnlineProduct } = require('../../models/OnlineClient/OnlineProduct')
const { OnlineService } = require('../../models/OnlineClient/OnlineService')
const { Room } = require('../../models/Rooms/Room')
const { RoomType } = require('../../models/Rooms/RoomType')
const { Department } = require('../../models/Services/Department')
const { Service } = require('../../models/Services/Service')
const { ServiceTable } = require('../../models/Services/ServiceTable')
const { ServiceType } = require('../../models/Services/ServiceType')
const { TableColumn } = require('../../models/Services/TableColumn')
const { StatsionarAdver } = require('../../models/StatsionarClient/StatsionarAdver')
const { StatsionarClient } = require('../../models/StatsionarClient/StatsionarClient')
const { StatsionarConnector } = require('../../models/StatsionarClient/StatsionarConnector')
const { StatsionarCounteragent } = require('../../models/StatsionarClient/StatsionarCounteragent')
const { StatsionarDaily } = require('../../models/StatsionarClient/StatsionarDaily')
const { StatsionarProduct } = require('../../models/StatsionarClient/StatsionarProduct')
const { StatsionarRoom } = require('../../models/StatsionarClient/StatsionarRoom')
const { StatsionarService } = require('../../models/StatsionarClient/StatsionarService')
const { Template } = require('../../models/Templates/Template')
const { User } = require('../../models/Users')
const { Product } = require('../../models/Warehouse/Product')
const { ProductConnector } = require('../../models/Warehouse/ProductConnector')
const { Warehouse } = require('../../models/Warehouse/Warehouse')

module.exports.register = async (req, res) => {
  try {
    const { error } = validateClinica(req.body)

    if (error) {
      return res.status(400).json({
        message: error.message,
      })
    }
    const {
      name,
      name2,
      site,
      licence,
      organitionName,
      image,
      phone1,
      phone2,
      phone3,
      bank,
      bankNumber,
      inn,
      address,
      orientation,
      director,
      mfo,
      ifud1,
      ifud2,
      ifud3,
      close_date
    } = req.body

    const clinica = await Clinica.find({ name })

    if (clinica.length > 0) {
      return res.status(400).json({
        message:
          "Diqqat! Klinika nomida biroz o'zgartirish qilib keyin kiriting.",
      })
    }

    const newClinica = new Clinica({
      name,
      name2,
      licence,
      organitionName,
      image,
      phone1,
      phone2,
      phone3,
      bank,
      bankNumber,
      inn,
      address,
      orientation,
      director,
      mfo,
      ifud1,
      ifud2,
      ifud3,
      close_date,
      isClose: false,
    })

    await newClinica.save()

    res.status(201).send(newClinica)
  } catch (error) {
    res.status(501).json({ message: error })
  }
}

module.exports.getClinica = async (req, res) => {
  try {
    const { clinicaId } = req.body
    if (!clinicaId) {
      return res.status(400).json({
        message: "Diqqat! Clinica ID si ko'rsatilmagan.",
      })
    }

    const clinica = await Clinica.findById(clinicaId)

    if (!clinica) {
      return res.status(400).json({
        message: "Diqqat! Ko'rsatilgan klinika ro'yxatdan o'tkazilmagan.",
      })
    }

    res.status(200).send(clinica)
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

module.exports.getClinicaList = async (req, res) => {
  try {

    const clinicas = await Clinica.find()
      .lean()

    for (const clinica of clinicas) {
      const director = await Director.findOne({
        clinica: clinica._id
      }).lean()

      clinica.director = director;
    }

    res.status(200).json(clinicas)

  } catch (error) {
    console.log(error);
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

module.exports.update = async (req, res) => {
  try {
    const clinica = req.body;

    const clinic = await Clinica.findById(clinica._id);
    if (!clinic) {
      return res.status(400).json({
        message:
          "Diqqat! Foydalanuvchi ro'yxatga olinayotgan klinika dasturda ro'yxatga olinmagan.",
      });
    }

    await Clinica.findByIdAndUpdate(clinica._id, { ...clinica, isClose: false  })

    const resdata = await Clinica.findById(clinica._id);

    res.send(resdata)
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

module.exports.delete = async (req, res) => {
  try {
    const { clinicaid } = req.body;

    const clinica = await Clinica.findById(clinicaid)
    if (!clinica) {
      return res.status(400).json({
        message: "Diqqat! Ko'rsatilgan klinika ro'yxatdan o'tkazilmagan.",
      })
    }

    await Adver.deleteMany({ clinica: clinicaid })
    await OfflineDiscount.deleteMany({ clinica: clinicaid })
    await OfflinePayment.deleteMany({ clinica: clinicaid })
    await StatsionarDiscount.deleteMany({ clinica: clinicaid })
    await StatsionarPayment.deleteMany({ clinica: clinicaid })
    await StatsionarPrePayment.deleteMany({ clinica: clinicaid })
    await CounterDoctor.deleteMany({ clinica: clinicaid })
    await Director.deleteMany({ clinica: clinicaid })
    await OfflineAdver.deleteMany({ clinica: clinicaid })
    await OfflineClient.deleteMany({ clinica: clinicaid })
    await OfflineConnector.deleteMany({ clinica: clinicaid })
    await OfflineCounteragent.deleteMany({ clinica: clinicaid })
    await OfflineProduct.deleteMany({ clinica: clinicaid })
    await OfflineService.deleteMany({ clinica: clinicaid })
    await OnlineAdver.deleteMany({ clinica: clinicaid })
    await OnlineClient.deleteMany({ clinica: clinicaid })
    await OnlineConnector.deleteMany({ clinica: clinicaid })
    await OnlineCounteragent.deleteMany({ clinica: clinicaid })
    await OnlineProduct.deleteMany({ clinica: clinicaid })
    await OnlineService.deleteMany({ clinica: clinicaid })
    await Room.deleteMany({ clinica: clinicaid })
    await RoomType.deleteMany({ clinica: clinicaid });
    await Department.deleteMany({ clinica: clinicaid })
    await Service.deleteMany({ clinica: clinicaid })
    await ServiceTable.deleteMany({ clinica: clinicaid })
    await ServiceType.deleteMany({ clinica: clinicaid })
    await TableColumn.deleteMany({ clinica: clinicaid })
    await StatsionarAdver.deleteMany({ clinica: clinicaid })
    await StatsionarClient.deleteMany({ clinica: clinicaid })
    await StatsionarConnector.deleteMany({ clinica: clinicaid })
    await StatsionarCounteragent.deleteMany({ clinica: clinicaid })
    await StatsionarDaily.deleteMany({ clinica: clinicaid })
    await StatsionarProduct.deleteMany({ clinica: clinicaid })
    await StatsionarRoom.deleteMany({ clinica: clinicaid });
    await StatsionarService.deleteMany({ clinica: clinicaid })
    await Template.deleteMany({ clinica: clinicaid })
    await Product.deleteMany({ clinica: clinicaid })
    await ProductConnector.deleteMany({ clinica: clinicaid })
    await Warehouse.deleteMany({ clinica: clinicaid })

    const deleteClinica = await Clinica.findByIdAndDelete(clinicaid);

    res.status(200).json(deleteClinica);

  } catch (error) {
    console.log(error);
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}



module.exports.getMainClinicas = async (req, res) => {
  try {

    const filials = await Clinica.find({
      mainclinica: true,
    })
      .select('-__v -isArchive -updatedAt')
      .populate('filials', 'name phone1')
      .lean()

    res.status(200).json(filials)

  } catch (error) {
    console.log(error);
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

module.exports.getAllClinicaForFilail = async (req, res) => {
  try {
    const clinicas = await Clinica.find({
    })
      .select('-__v -isArchive -updatedAt')
      .lean()
      .then(clinicas => clinicas.filter(clinica => !clinica.mainclinica && !clinica.isFilial));

    res.status(200).json(clinicas)

  } catch (error) {
    console.log(error);
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

module.exports.filialsCreate = async (req, res) => {
  try {
    const { mainclinica, filials } = req.body;

    const clinic = await Clinica.findById(mainclinica)
    if (!clinic) {
      return res.status(400).json({
        message:
          "Diqqat! Bosh klinika topilmadi!",
      })
    }

    for (const filial of filials) {
      const checkFilial = await Clinica.findById(filial)
      if (!checkFilial) {
        return res.status(400).json({
          message:
            "Diqqat! Klinika filiallarida xato yuz berdi!.",
        })
      }
    }

    const mainClinica = await Clinica.findById(mainclinica);
    mainClinica.mainclinica = true;
    mainClinica.isFilial = false;
    mainClinica.filials = filials
    await mainClinica.save();

    for (const filial of filials) {
      const clinicaFilial = await Clinica.findById(filial)
      clinicaFilial.isFilial = true;
      clinicaFilial.mainclinica = false;
      clinicaFilial.filials = [];

      await clinicaFilial.save()
    }

    res.status(200).json({ message: "Filiallar bog'landi!" });

  } catch (error) {
    console.log(error);
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}