import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3001/api';

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
    try {
      const response = await axios.post(
        `${API_BASE_URL}/extract-logistics`,
        { text }
      );
      return response.data;
    } catch (error) {
      throw new Error(`文本提取失败: ${error.message}`);
    }
  }

  /**
   * 文件路径提取
   * @param {string} filePath - 文件路径
   * @returns {Promise} API响应
   */
  static async extractFromFilePath(filePath) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/extract-logistics`,
        { filePath }
      );
      return response.data;
    } catch (error) {
      throw new Error(`文件路径提取失败: ${error.message}`);
    }
  }

  /**
   * 文件上传提取
   * @param {File} file - 上传的文件对象
   * @returns {Promise} API响应
   */
  static async extractFromFileUpload(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${API_BASE_URL}/upload-extract`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`文件上传提取失败: ${error.message}`);
    }
  }

  /**
   * 统一的提取方法
   * @param {string} inputType - 输入类型: 'text', 'file', 'upload'
   * @param {string|File} inputData - 输入数据
   * @returns {Promise} API响应
   */
  static async extractData(inputType, inputData) {
    switch (inputType) {
      case 'text':
        return await this.extractFromText(inputData);
      case 'file':
        return await this.extractFromFilePath(inputData);
      case 'upload':
        return await this.extractFromFileUpload(inputData);
      default:
        throw new Error('不支持的输入类型');
    }
  }
}

export default ExtractApiService;
