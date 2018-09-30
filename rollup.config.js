import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

import pkg from './package.json';

import * as s3 from 'aws-sdk/clients/s3';
import * as mime from 'mime';


const  S3UploadPlugin = function(options) {
  const data = {};
  options = options || {};
  data.opts = options;
  data.s3 = new s3();
  data.bucketName = options.bucketName || process.env.S3_BUCKET;
  data.prefix = options.prefix || process.env.S3_PREFIX;

  data.uploadFile = async function(key, data) {
    const ext = key.slice(0).split('.').pop();

    const params = {
      Bucket: this.bucketName,
      Key: `${this.prefix}/${key}`,
      Body: data,
      ContentType: mime.getType(ext), // Ensure file is uploaded with correct content type
    };

    await this.s3.putObject(params).promise();
    console.log(`Uploaded to https://s3.${this.s3.config.region}.amazonaws.com/${this.bucketName}/${this.prefix}`)
  }

  data.generateBundle = function(outputOptions, bundle, isWrite) {
    for(const fileName in bundle) {
      data.uploadFile(fileName, bundle[fileName]["code"]);
    }
  }
  return data;
};


export default [{
  input: 'src/main.js',
  output: {
    name: 'window',
    file: pkg.main,
    format: 'umd',
    extend: true
  },
  plugins: [
    json(),
    resolve(),
    commonjs(),
    S3UploadPlugin()
  ]
}];