import { customAlphabet } from 'nanoid/async';

/**
 * nano 生成随机ID
 * @param rule 规则-默认数字
 * @param number 生成位数-默认10位
 * @returns Promise<string> '2428230181893939'
 */
export const generateId = async (
  rule = '1234567890',
  number = 16,
): Promise<number> => {
  const nanoid = customAlphabet(rule, number);
  const id = await nanoid();
  return +id;
};

// 两天
export const TWO_DAYS = 2000 * 24 * 3600 * 1000;

// 2h
export const TWO_HOUR = 2000 * 3600 * 1000;
