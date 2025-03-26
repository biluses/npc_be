import { AllPolicy } from '../../models'

const PolicyServices = {
    async create(req, res, next) {
        const { type, description } = req.body

        const findPolicy = await AllPolicy.findOne({
            type
        })

        if (findPolicy) {
            throw new Error("Policy already exist with this type");
        }

        const policy = await AllPolicy.create({
            type,
            description
        });

        return { policy: policy };
    },

    async update(req, res, next) {
        const { description } = req.body
        let payload = {
            description
        }
        await AllPolicy.update(payload, {
            where: {
                id: req.params.id
            }
        });

        const policy = await AllPolicy.findOne({
            where: {
                id: req.params.id,
            },
        });

        return { policy: policy };
    },

    async getPolicyDetail(req, res, next) {
        const policy = await AllPolicy.findOne({
            where: {
                id: req.query.id,
            },
        });

        if (!policy) {
            throw new Error("Invalid policyId");
        }

        return { policy: policy };
    },

    async getAllPolicy(req, res, next) {
        const policy = await AllPolicy.findAll();

        return { policy: policy };
    },

    async getPolicyDetailsByType(req, res, next) {

        if(!req.query.type){
            throw new Error("Type is required");
        }

        const policy = await AllPolicy.findOne({
            where: {
                type: req.query.type,
            },
        });

        if(!policy){
            throw new Error("Invalid type");
        }

        return { policy: policy };
    }
}

module.exports = PolicyServices;