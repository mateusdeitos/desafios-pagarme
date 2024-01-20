import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class EncryptionService {
  private iv = randomBytes(16);
  private key = randomBytes(32);

  async encrypt(value: string) {
    const cipher = createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.key),
      this.iv,
    );
    let encrypted = cipher.update(value);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  }

  async decrypt(value: string) {
    const encryptedText = Buffer.from(value, 'hex');
    const decipher = createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.key),
      this.iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
