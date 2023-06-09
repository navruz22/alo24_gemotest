export const checkClientData = (client) => {
    if (!client.firstname) {
        return {
            title: "Diqqat! Mijoz ismi kiritilmagan.",
            description: "Iltimos foydalanuvchi ismini kiriting.",
            status: "error",
        };
    }

    if (!client.lastname) {
        return {
            title: "Diqqat! Mijoz familiyasi kiritilmagan.",
            description: "Iltimos foydalanuvchi familiyasini kiriting.",
            status: "error",
        };
    }

    if (!client.born) {
        return {
            title: "Diqqat! Mijozning tug'ilgan sanasi kiritilmagan.",
            description: "Iltimos mijozning tug'ilgan sanasini kiriting.",
            status: "error",
        };
    }

    if (client.phone && client.phone.length !== 9) {
        return {
            title: "Diqqat! Mijoz telefon raqami 9 raqamdan iborat bo'lishi kerak.",
            description: "Iltimos foydalanuvchi telefon raqamini to'g'ri kiriting.",
            status: "error",
        };
    }

    if (!client.gender) {
        return {
            title: "Diqqat! Mijozning jinsi tanlanmagan.",
            description: "Iltimos mijozning jinsini tanlang.",
            status: "error",
        };
    }

    if (!client.national) {
        return {
            title: 'Diqqat! Mijozning fuqorosi tanlanmagan.',
            description: 'Iltimos mijozning fuqorosini tanlang.',
            status: 'error',
        }
    }

    return false;
};

export const checkServicesData = (services) => {
    for (const service of services) {
        if (service.pieces === "0") {
            return {
                title: `Diqqat! ${service.service.name} xizmati soni 0 ko'rsatilgan.`,
                description: `Iltimos xizmat ko'rsatilmasa uni ro'yxatdan o'chiring yoki xizmat sonini kiriting.`,
                status: "error",
            };
        }
    }
    return false;
};

export const checkProductsData = (products) => {
    for (const product of products) {
        if (product.pieces === "0") {
            return {
                title: `Diqqat! ${product.product.name} mahsuloti soni 0 ko'rsatilgan.`,
                description: `Iltimos mahsulot qo'shilmasa uni ro'yxatdan o'chiring yoki mahsulot sonini kiriting.`,
                status: "error",
            };
        }
    }
    return false;
};

export const checkConnectorData = (connector, client) => {
    if (!connector.doctor && !client._id) {
        return {
            title: "Diqqat! Mijozga shifokor biriktirilmagan.",
            description: "Iltimos mijozga shifokor biriktiring.",
            status: "error",
        };
    }
    return false;
};

export const checkRoomData = (room, client) => {
    if (!room.roomid && !client._id) {
        return {
            title: "Diqqat! Mijozga xona biriktirilmagan.",
            description: "Iltimos mijozga xona biriktiring.",
            status: "error",
        };
    }

    if (!room.beginday && !client._id) {
        return {
            title: "Diqqat! Mijozning kelgan kuni kiritilmagan.",
            description: "Iltimos mijozning kelgan kunini kiriting.",
            status: "error",
        };
    }
    return false;
};

