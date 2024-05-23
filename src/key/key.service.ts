import { Injectable } from '@nestjs/common';

@Injectable()
export class KeyService {
  generateKey(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const keyLength = 5;
    const groupCount = 4;

    let key = '';

    for (let group = 0; group < groupCount; group++) {
      let groupKey = '';
      for (let i = 0; i < keyLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        groupKey += characters[randomIndex];
      }
      key += groupKey;
      if (group < groupCount - 1) {
        key += '-';
      }
    }

    return key;
  }
}
