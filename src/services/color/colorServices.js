import { Color, ProductVariant, ProductImage } from '../../models'

const ColorServices = {
    async create(req, res, next) {
        const { name, code } = req.body

        const findColor = await Color.findOne({
            where: {
                name: name
            }
        })

        if (findColor) {
            throw new Error("Color already exist with this name");
        }

        const color = await Color.create({
            name,
            code
        });

        return { color: color };
    },

    async update(req, res, next) {
        const { name, code } = req.body
        let payload = {
            name,
            code
        }
        await Color.update(payload, {
            where: {
                id: req.params.id
            }
        });

        const color = await Color.findOne({
            where: {
                id: req.params.id,
            },
        });

        return { color: color };
    },

    async delete(req, res, next) {
        const colorId = req.params.id;

        if (colorId == 1 || colorId == "1") {
            throw new Error("You can't delete this color option.");
        }

        const variantCount = await ProductVariant.count({ where: { colorId } });
        const imageCount = await ProductImage.count({ where: { colorId } });

        if (variantCount > 0 || imageCount > 0) {
            throw new Error("Cannot delete color. It is being used in product variants or images.");
        }

        const color = await Color.findByPk(colorId);
        if (!color) {
            throw new Error("Color not found");
        }

        await color.destroy();

        return true;
    },

    async getColorDetail(req, res, next) {
        const color = await Color.findOne({
            where: {
                id: req.query.id,
            },
        });

        if (!color) {
            throw new Error("Invalid colorId");
        }

        return { color: color };
    },

    async getAllColor(req, res, next) {
        const color = await Color.findAll();

        return { color: color };
    },
}

module.exports = ColorServices;