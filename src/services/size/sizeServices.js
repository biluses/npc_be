import { Size, ProductVariant } from '../../models'

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

    async delete(req, res, next) {
        const sizeId = req.params.id;

        if (sizeId == 1 || sizeId == "1") {
            throw new Error("You can't delete this size option.");
        }

        const variantCount = await ProductVariant.count({ where: { sizeId } });

        if (variantCount > 0) {
            throw new Error("Cannot delete size. It is being used in product variants.");
        }

        const size = await Size.findByPk(sizeId);
        if (!size) {
            throw new Error("Size not found");
        }

        await size.destroy();

        return true;
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