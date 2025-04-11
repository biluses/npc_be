import { Size } from '../../models'

const SizeServices = {
    async create(req, res, next) {
        const { name } = req.body

        const findSize = await Size.findOne({
            where: {
                name: name
            }
        })

        if (findSize) {
            throw new Error("Size already exist with this name");
        }

        const size = await Size.create({
            name
        });

        return { size: size };
    },

    async update(req, res, next) {
        const { name } = req.body
        let payload = {
            name
        }
        await Size.update(payload, {
            where: {
                id: req.params.id
            }
        });

        const size = await Size.findOne({
            where: {
                id: req.params.id,
            },
        });

        return { size: size };
    },

    async getSizeDetail(req, res, next) {
        const size = await Size.findOne({
            where: {
                id: req.query.id,
            },
        });

        if (!size) {
            throw new Error("Invalid sizeId");
        }

        return { size: size };
    },

    async getAllSize(req, res, next) {
        const size = await Size.findAll();

        return { size: size };
    },
}

module.exports = SizeServices;