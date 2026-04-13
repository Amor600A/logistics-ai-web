import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3001/api';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒

/**
 * 通用的API请求函数
 * @param {string} apiPath - API路径
 * @param {object} body - 请求体
 * @param {object} options - 请求选项
 * @param {function} validateBody - 请求体验证函数
 * @returns {Promise} API响应
 */
const makeApiRequest = async (apiPath, body = null, options = {}, validateBody = null) => {
    // 验证请求体
    if (validateBody) {
        const validationResult = validateBody(body);
        if (!validationResult.valid) {
            throw new Error(`请求参数验证失败: ${validationResult.message}`);
        }
    }

    // 重试机制
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const config = {
                url: `${API_BASE_URL}${apiPath}`,
                method: 'POST',
                ...options
            };

            if (body) {
                config.data = body;
            }

            const response = await axios(config);

            // 验证响应结果
            if (!response) {
                throw new Error('API返回空响应');
            }

            if (response.status !== 200) {
                throw new Error(`API返回错误码: ${response.status}`);
            }

            if (!response.data) {
                throw new Error('API响应数据为空');
            }

            // 检查响应码
            if (response.data.code !== 200 && response.data.code !== undefined) {
                throw new Error(response.data.msg || `API返回错误码: ${response.data.code}`);
            }

            return response.data;

        } catch (error) {
            // 如果是最后一次尝试，直接抛出错误
            if (attempt === MAX_RETRIES) {
                throw new Error(`API请求失败: ${error.message}`);
            }

            // 网络错误或服务器错误时重试
            if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED' ||
                (error.response && error.response.status >= 500)) {
                console.warn(`API请求失败，第${attempt}次重试...`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
                continue;
            }

            // 其他错误直接抛出
            throw new Error(`API请求失败: ${error.message}`);
        }
    }
};

/**
 * 提取物流数据的API服务
 */
class ExtractApiService {
    /**
     * 文本内容提取
     * @param {string} text - 物流单据文本
     * @returns {Promise} API响应
     */
    static async extractFromText(text) {
        // 验证文本参数
        const validateTextBody = (body) => {
            if (!body.text || typeof body.text !== 'string' || body.text.trim().length === 0) {
                return { valid: false, message: '文本内容不能为空' };
            }
            if (body.text.length > 10000) {
                return { valid: false, message: '文本内容长度不能超过10000个字符' };
            }
            return { valid: true };
        };

        return await makeApiRequest(
            '/extract-logistics',
            { text: text.trim() },
            {},
            validateTextBody
        );
    }

    /**
     * 文件路径提取
     * @param {string} filePath - 文件路径
     * @returns {Promise} API响应
     */
    static async extractFromFilePath(filePath) {
        // 验证文件路径参数
        const validateFilePathBody = (body) => {
            if (!body.filePath || typeof body.filePath !== 'string' || body.filePath.trim().length === 0) {
                return { valid: false, message: '文件路径不能为空' };
            }

            // 简单的路径格式验证
            const pathRegex = /^[a-zA-Z]:\\[^/:*?"<>|]+$/;
            if (!pathRegex.test(body.filePath)) {
                return { valid: false, message: '文件路径格式不正确' };
            }

            return { valid: true };
        };

        return await makeApiRequest(
            '/extract-logistics',
            { filePath: filePath.trim() },
            {},
            validateFilePathBody
        );
    }

    /**
     * 文件上传提取
     * @param {File} file - 上传的文件对象
     * @returns {Promise} API响应
     */
    static async extractFromFileUpload(file) {
        // 验证文件参数
        const validateFileBody = (body) => {
            if (!body || !(body instanceof FormData)) {
                return { valid: false, message: '文件数据格式不正确' };
            }

            const fileData = body.get('file');
            if (!fileData) {
                return { valid: false, message: '未找到文件数据' };
            }

            return { valid: true };
        };

        const formData = new FormData();
        formData.append('file', file);

        return await makeApiRequest(
            '/upload-extract',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            },
            validateFileBody
        );
    }
}

export default ExtractApiService;