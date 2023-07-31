import * as crypto from 'crypto';

interface EncryptProperties {
  secretKey: string;
  secretInitialVector: string;
  encryptionMethod: string;
}

export class Encrypt {
  constructor(private readonly props: EncryptProperties) {}

  private key = crypto.scryptSync(this.props.secretKey, 'salt', 24);
  private iv = Buffer.alloc(16, this.props.secretInitialVector);

  public encryptData(data) {
    console.log(this.iv);
    const cipher = crypto.createCipheriv('aes-192-cbc', this.key, this.iv);
    console.log('RAPAZ', cipher);
    let cipherData = cipher.update(JSON.stringify(data), 'utf-8', 'hex');
    cipherData += cipher.final('hex');
    return cipherData;
  }

  // Decrypt data
  public decryptData(encryptedData) {
    // const buff = Buffer.from(encryptedData, 'base64');
    const decipher = crypto.createDecipheriv('aes-192-cbc', this.key, this.iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
