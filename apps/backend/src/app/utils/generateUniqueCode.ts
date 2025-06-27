

export const generateUniqueCode = (digit: number) => {
  if (digit <= 0) throw new Error('Digit must be a positive number.');

  const now = Date.now().toString();

  const randomPartLength = Math.max(0, digit - now.length);
  const randomPart = Array(randomPartLength)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10))
    .join('');

  const uniqueCode = (now + randomPart).slice(-digit);

  return uniqueCode;
};

const generatedIds = new Set<string>(); // আগে তৈরি হওয়া IDs সংরক্ষণের জন্য।

export const generateUnique = (digit: number) => {
  if (digit <= 0) throw new Error('Digit must be a positive number.');

  let uniqueId = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  do {
    const randomPart = Array(digit)
      .fill(0)
      .map(() => characters[Math.floor(Math.random() * characters.length)])
      .join('');
    const timestamp = Date.now().toString(36); // টাইমস্ট্যাম্প যোগ করা।
    uniqueId = `${timestamp}-${randomPart}`;
  } while (generatedIds.has(uniqueId)); // চেক করুন যে এটি আগে তৈরি হয়নি।

  generatedIds.add(uniqueId); // নতুন আইডি সেভ করুন।
  return uniqueId;
};
