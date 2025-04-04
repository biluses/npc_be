import { getReasonPhrase } from "http-status-codes";
import { User, Admin } from "../models"
const { uuid } = require("unique-string-generator");
const nodemailer = require("nodemailer");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const { uploadDir } = require('../constant');

export const generateResponse = (
    req,
    res,
    status_code,
    status,
    message = "",
    data
) => {
    message = message === "" ? getReasonPhrase(status_code) : message;

    const response = {
        status,
        message,
        ...data,
    };

    return res.status(status_code).json(response);
};

export const upload_file = async function (
    req,
    res,
    next,
    file_name = "",
    directory_name = "",
    allowedTypes = []

) {
    const files = req.files;
    if (files && files.length > 0) {
        for (const file of files) {
            if (file.fieldname === file_name) {
                const fileExtension = file.mimetype.split('/')[1];
                if (allowedTypes.length > 0 && !allowedTypes.includes(fileExtension)) {
                    console.log(`File type not allowed: ${fileExtension}`);
                    return false;
                }
                const filename = uuidv4() + "_" + file.originalname.replace(/\s/g, "");
                let dirname = `./${uploadDir.UPLOAD_DIR}`;
                if (directory_name) {
                    dirname += `/${directory_name}`;
                }

                if (!fs.existsSync(dirname)) {
                    fs.mkdirSync(dirname, { recursive: true });
                }

                const filePath = `${dirname}/${filename}`;
                try {
                    fs.writeFileSync(filePath, file.buffer);
                    return filename;
                } catch (error) {
                    console.log(error);
                    return false;
                }
            }
        }
    } else {
        return false;
    }
};

export const delete_file = async function (file_path = "") {
    if (!file_path) {
        throw new Error("File path is required");
    }
    try {
        file_path = "./" + uploadDir.UPLOAD_DIR + "/" + file_path;
        if (fs.existsSync(file_path)) {
            await fs.promises.unlink(file_path);
            return true;
        } else {
            return false;
            // throw new Error("File does not exist");
        }
    } catch (error) {
        console.error("Error deleting file:", error);
        return false;
    }
};

export const sendMail = async function (to = "", subject = "", html = "", attachements = "") {
    try {

        if (to == "" || subject == "" || html == "") return false

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: process.env.MAIL_SENDER,
            to: to,
            subject: subject,
            html: html,
            attachements: attachements
        });

        return true

    } catch (err) {
        console.log('send_mail error', err)
        return false
    }

}

export const generateSecretId = async function (isAdmin) {
    let secretId = uuidv4()
    if (isAdmin) {
        var isSecretData = await Admin.findOne({ where: { secretId: secretId } })
    } else {
        var isSecretData = await User.findOne({ where: { secretId: secretId } })
    }
    if (isSecretData) {
        generateSecretId();
    }
    return secretId;
}

export const buildCommentTree = function (comments, parentId = null) {
    const commentTree = [];

    comments
        .filter(comment => comment.parentId === parentId)
        .forEach(comment => {
            const children = buildCommentTree(comments, comment.id);
            comment.replies = children;
            commentTree.push(comment);
        });
    return commentTree;
}