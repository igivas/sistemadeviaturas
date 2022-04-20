import { encodePassword, compareHash } from './ScriptCaseCrypt';
import IHashProvider from './IHashProvider';

class ScriptCaseHashProvider implements IHashProvider {
  public async generateHash(password: string): Promise<string> {
    return encodePassword(password);
  }

  public async compareHash(password: string, hashed: string): Promise<boolean> {
    return compareHash(password, hashed);
  }
}

export default ScriptCaseHashProvider;
