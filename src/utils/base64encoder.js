export const encodeBase64 = (str) => {
    return Buffer.from(str).toString('base64');
};
