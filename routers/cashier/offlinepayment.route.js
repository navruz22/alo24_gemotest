const {
    validatePayment,
    OfflinePayment,
} = require("../../models/Cashier/OfflinePayment");
const { OfflineService } = require("../../models/OfflineClient/OfflineService");
const { OfflineClient } = require("../../models/OfflineClient/OfflineClient");
const { OfflineProduct } = require("../../models/OfflineClient/OfflineProduct");
const { ProductConnector } = require("../../models/Warehouse/ProductConnector");
const { Product } = require("../../models/Warehouse/Product");
const {
    OfflineConnector,
} = require("../../models/OfflineClient/OfflineConnector");
const {
    OfflineDiscount,
    validateDiscount,
} = require("../../models/Cashier/OfflineDiscount");
const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
require("../../models/Services/Department");

//Payment
module.exports.payment = async (req, res) => {
    try {
        const { payment, discount, services, products } = req.body;

        // CheckPayment
        const checkPayment = validatePayment(payment).error;
        if (checkPayment) {
            return res.status(400).json({
                error: checkPayment.message,
            });
        }

        // CheckDiscount
        if (!discount._id) {
            const checkDiscount = validateDiscount(discount).error;
            if (checkDiscount) {
                return res.status(400).json({
                    error: error.message,
                });
            }
        }

        //Update Services and Products
        services &&
            services.map(async (service) => {
                const update = await OfflineService.findByIdAndUpdate(
                    service._id,
                    service
                );

                //=========================================================
                // Product decrement
                const productconnectors = await ProductConnector.find({
                    clinica: service.clinica,
                    service: service.serviceid,
                });

                if (service.refuse) {
                    for (const productconnector of productconnectors) {
                        const product = await Product.findById(productconnector.product);
                        product.total =
                            product.total + productconnector.pieces * service.pieces;
                        await product.save();
                    }
                }
            });

        products &&
            products.map(async (product) => {
                const update = await OfflineProduct.findByIdAndUpdate(
                    product._id,
                    product
                );

                //=========================================================
                // Product decrement
                if (product.refuse) {
                    const produc = await Product.findById(product.productid);
                    produc.total = produc.total + product.pieces;
                    await produc.save();
                }
            });

        // Delete Debets
        const debts = await OfflinePayment.find({ connector: payment.connector });
        for (const debt of debts) {
            const update = await OfflinePayment.findByIdAndUpdate(debt._id, {
                debt: 0,
            });
        }
        // CreatePayment
        const newpayment = new OfflinePayment({ ...payment });
        await newpayment.save();

        const updateConnector = await OfflineConnector.findById(payment.connector);
        updateConnector.payments.push(newpayment._id);

        // CreateDiscount
        if (updateConnector.discount) {
            await OfflineDiscount.findByIdAndUpdate(
                updateConnector.discount,
                discount
            );
        } else if (discount.discount && discount.comment.length > 2) {
            const newdiscount = new OfflineDiscount({
                ...discount,
                payment: newpayment._id,
            });
            await newdiscount.save();

            newpayment.discount = newdiscount._id;
            await newpayment.save();

            updateConnector.discount = newdiscount._id;
        }

        await updateConnector.save();

        res.status(201).send(newpayment);
    } catch (error) {
        console.log(error);
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
};

//Clients getall
module.exports.getAll = async (req, res) => {
    try {
        const { clinica, beginDay, endDay, clientborn } = req.body;
        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        let connectors = null;

        if (clientborn) {
            connectors = await OfflineConnector.find({
                clinica
            })
                .populate("client", "-createdAt -updatedAt -isArchive -__v")
                .populate({
                    path: "services",
                    select: "-__v -updatedAt -isArchive",
                    populate: {
                        path: "department",
                        select: "room probirka"
                    }
                })
                .populate("products")
                .populate("payments")
                .populate("discount")
                .sort({ _id: -1 })
                .lean()
                .then(connectors => {
                    return connectors.filter(connector => {
                        return new Date(new Date(connector.client.born).setUTCHours(0, 0, 0, 0)).toISOString() === new Date(new Date(clientborn).setUTCHours(0, 0, 0, 0)).toISOString()
                    });
                })
        } else {
            connectors = await OfflineConnector.find({
                clinica,
                updatedAt: {
                    $gte: beginDay,
                    $lte: endDay,
                },
            })
                .populate("client", "-createdAt -updatedAt -isArchive -__v")
                .populate({
                    path: "services",
                    select: "-__v -updatedAt -isArchive",
                    populate: {
                        path: "department",
                        select: "room probirka"
                    }
                })
                .populate("products")
                .populate("payments")
                .populate("discount")
                .sort({ updatedAt: -1 })
                .lean()
        }

        res.status(200).send(connectors);
    } catch (error) {
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
};

module.exports.getPayments = async (req, res) => {
    try {
        const { clinica, beginDay, endDay, clientborn } = req.body;
        const clinic = await Clinica.findById(clinica);

        if (!clinic) {
            return res.status(400).json({
                message: "Diqqat! Klinika ma'lumotlari topilmadi.",
            });
        }

        let connectors = null;

        if (clientborn) {
            connectors = await OfflinePayment.find({
                clinica
            })
                .sort({ createdAt: -1 })
                .select("-__v -updatedAt -isArchive")
                .populate("client", "-updatedAt -isArchive -__v")
                .populate("discount", "-updatedAt -isArchive -__v")
                .populate({
                    path: "connector",
                    select: "-__v -updatedAt -isArchive",
                    populate: {
                        path: "services",
                        select: "-__v -updatedAt -isArchive",
                        populate: {
                            path: "department",
                            select: "room name"
                        }
                    }
                })
                .populate({
                    path: "connector",
                    select: "-__v -updatedAt -isArchive",
                    populate: {
                        path: "products",
                        select: "-__v -updatedAt -isArchive",
                    }
                })
                .populate({
                    path: "connector",
                    select: "-__v -updatedAt -isArchive",
                    populate: {
                        path: "payments",
                        select: "-__v -updatedAt -isArchive",
                    }
                })
                .populate({
                    path: "connector",
                    select: "-__v -updatedAt -isArchive",
                    populate: {
                        path: "discount",
                        select: "-__v -updatedAt -isArchive",
                    }
                })
                .lean()
                .then(connectors => {
                    return connectors.filter(connector => {
                        return new Date(new Date(connector.client.born).setUTCHours(0, 0, 0, 0)).toISOString() === new Date(new Date(clientborn).setUTCHours(0, 0, 0, 0)).toISOString()
                    });
                })
        } else {

            connectors = await OfflinePayment.find({
                clinica,
                createdAt: {
                    $gte: beginDay,
                    $lte: endDay,
                },
            })
                .sort({ createdAt: -1 })
                .select("-__v -updatedAt -isArchive")
                .populate("client", "-updatedAt -isArchive -__v")
                .populate("discount", "-updatedAt -isArchive -__v")
                .populate({
                    path: "connector",
                    select: "-__v -updatedAt -isArchive",
                    populate: {
                        path: "services",
                        select: "-__v -updatedAt -isArchive",
                        populate: {
                            path: "department",
                            select: "room name"
                        }
                    }
                })
                .populate({
                    path: "connector",
                    select: "-__v -updatedAt -isArchive",
                    populate: {
                        path: "products",
                        select: "-__v -updatedAt -isArchive",
                    }
                })
                .populate({
                    path: "connector",
                    select: "-__v -updatedAt -isArchive",
                    populate: {
                        path: "payments",
                        select: "-__v -updatedAt -isArchive",
                    }
                })
                .populate({
                    path: "connector",
                    select: "-__v -updatedAt -isArchive",
                    populate: {
                        path: "discount",
                        select: "-__v -updatedAt -isArchive",
                    }
                })
                .lean()
        }

        res.status(200).send(connectors);
    } catch (error) {
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}
