const shiftString = (text: string, shiftPace: number): string => {
  let strCoded = '';
  let ASCIIToChar;
  // eslint-disable-next-line
  text.split('').map(letter => {
    const letterToASCII = letter.charCodeAt(0);
    if (letterToASCII >= 97 && letterToASCII <= 122) {
      ASCIIToChar = letterToASCII + shiftPace;

      if (ASCIIToChar > 122) ASCIIToChar -= 26;
    } else if (letterToASCII >= 65 && letterToASCII <= 90) {
      ASCIIToChar = letterToASCII + shiftPace;
      if (ASCIIToChar > 90) ASCIIToChar -= 26;
    } else ASCIIToChar = letterToASCII;

    strCoded = strCoded.concat(String.fromCharCode(ASCIIToChar));
  });

  return strCoded;
};

const decBin = (number: number): string => {
  let num: number = number;
  if (number < 0) {
    num = 0xffffffff + number + 1;
  }
  return parseInt(String(num), 10).toString(2);
};

const binDec = (binStr: string): number => {
  // eslint-disable-next-line
  const newbinStr = (binStr + '').replace(/[^01]/gi, '');
  return parseInt(newbinStr, 2);
};

const convertBase10To64 = (decValue: number): string => {
  let initialStr = 65;
  if (decValue > 0) {
    if (decValue < 52) {
      initialStr += decValue;
      if (decValue > 25) initialStr += 6;
    } else if (decValue >= 52 && decValue < 62) {
      initialStr -= 17;
      initialStr += decValue - 52;
    } else if (decValue === 62) initialStr = 43;
    else if (decValue === 63) initialStr = 47;
    else if (decValue === 64) initialStr = 61;
    else initialStr = 97;
  }
  return String.fromCharCode(initialStr);
};

const encodeString = (text: string, secretKey: string): string => {
  let secretKeyLength = 0;
  let strCipher = '';
  let strBinChars = '';
  // eslint-disable-next-line
  text.split('').map((letter, index) => {
    const charAtSecretKey = secretKey.charAt(secretKeyLength);
    // eslint-disable-next-line
    secretKeyLength++;
    if (secretKeyLength >= secretKey.length) {
      secretKeyLength = 0;
    }
    let letterToASCII = letter.charCodeAt(0) ^ charAtSecretKey.charCodeAt(0);
    letterToASCII += secretKey.length;
    let strChars = decBin(letterToASCII);
    while (strChars.length < 8) {
      // eslint-disable-next-line
      strChars = '0' + strChars;
    }
    strBinChars = strBinChars.concat(strChars);
  });

  let size = 0;
  for (let i = 0; i < strBinChars.length; i += 4) {
    const strOf4Bits = strBinChars.substr(i, 4);
    const ASCII4bit = binDec(strOf4Bits);
    const ASCIIDecimal = ASCII4bit * 4 + size;
    strCipher = strCipher.concat(convertBase10To64(ASCIIDecimal));
    // eslint-disable-next-line
    size++;
    if (size > 3) size = 0;
  }
  return strCipher;
};

const cryptSubstitution = (text: string, action: string): string => {
  const strDecode = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(
    '',
  );
  const strEncode = 'blPqoVjBiOrnDucdxLyICaRSfAkFQsNtmzZKMpHeTGWhUXJwvYgE_'.split(
    '',
  );

  const arrDecode: any = [];
  const arrEncode: any = [];
  // eslint-disable-next-line
  strDecode.map((character, index) => {
    arrDecode[strEncode[index]] = strDecode[index];
    arrEncode[strDecode[index]] = strEncode[index];
  });

  let strCipher = '';
  const arrCipher = action === 'dec' ? arrDecode : arrEncode;
  // eslint-disable-next-line
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    strCipher = strCipher.concat(
      Object.values(arrCipher).includes(char) ? arrCipher[char] : char,
    );
  }
  return strCipher;
};

export const encodePassword = (password: string): string => {
  let encodedString = shiftString(password, 5);
  encodedString = encodeString(encodedString, 'filet com fritas');
  encodedString = cryptSubstitution(encodedString, 'enc');
  encodedString = encodeString(encodedString, 'arroz com feijao');
  encodedString = shiftString(encodedString, 17);

  return encodedString;
};

export const compareHash = (password: string, hash: string): boolean => {
  const cryptPassword = encodePassword(password);
  return cryptPassword === hash;
};
