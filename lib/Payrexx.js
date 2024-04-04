const qs = require('qs')
const axios = require('axios')
const Base64 = require('crypto-js/enc-base64')
const hmacSHA256 = require('crypto-js/hmac-sha256')

class Payrexx {
    instance;
    secret;
    baseUrl;

    constructor(instance, secret, baseUrl = 'https://api.payrexx.com/v1.0/') {
        this.instance = instance;
        this.secret = secret;
        this.baseUrl = baseUrl;
    }

    buildSignature(data) {
        let queryStr = '';
        if (data) {
            queryStr = qs.stringify(data, {format: 'RFC1738'});
            queryStr = queryStr.replace(/[!'()*~]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
        }
        return Base64.stringify(hmacSHA256(queryStr, this.secret))
    }

    buildBaseUrl(path) {
        return this.baseUrl + path + '?instance=' + this.instance
    }

    async get(endpoint, id) {
        const baseUrl = this.buildBaseUrl(endpoint + '/' + id + '/')
        const url = baseUrl + '&ApiSignature=' + this.buildSignature()
        let result = {};
        try {
            const response = await axios.get(url);
            result = response.data;
        } catch (e) {
            result = e.response.data;
        }
        return result;
    }

    async getAll(endpoint) {
        const baseUrl = this.buildBaseUrl(endpoint + '/')
        const url = baseUrl + '&ApiSignature=' + this.buildSignature()
        let result = {};
        try {
            const response = await axios.get(url);
            result = response.data;
        } catch (e) {
            result = e.response.data;
        }
        return result;
    }

    async post(endpoint, data) {
        data.ApiSignature = this.buildSignature(data)
        const queryStr = qs.stringify(data)

        const baseUrl = this.buildBaseUrl(endpoint + '/')
        let result = {};
        try {
            const response = await axios.post(baseUrl, queryStr)
            result = response.data;
        } catch (e) {
            result = e.response.data;
        }
        return result;
    }
}
module.exports = Payrexx;