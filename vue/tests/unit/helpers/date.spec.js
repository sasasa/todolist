import { oneWeekBefore, oneWeekLater, now } from '@/helpers/date'

describe('Date helpers', () => {
  // 日付を固定 2019/8/1 12:00:00
  let nowValue;
  let spiedDate;
  let spiedDate3;
  // let spiedParse;

  // setup
  beforeAll(() => {
    const OriginalDate = Date; // 退避
    nowValue = new OriginalDate('2019/8/1 12:00:00');
    // Date.now() と new Date() のみmocking
    // Date.now = jest.fn().mockReturnValue(nowValue.valueOf());

    // spiedParse = jest.spyOn(Date, 'parse').mockImplementation((arg) => {
    //   return OriginalDate.parse(arg);
    // })
    spiedDate = jest.spyOn(global, 'Date').mockImplementation((arg) => {
      if (arg === 0 || arg) {
        return new OriginalDate(arg);
      }
      return nowValue;
    })
    spiedDate3 = jest.spyOn(global, 'Date').mockImplementation((arg1, arg2, arg3) => {
      if (arg1 === 0 || arg1) {
        return new OriginalDate(arg1, arg2, arg3);
      }
      return nowValue;
    })
  })
  afterAll(() => {
    spiedDate.mockRestore();
    spiedDate3.mockRestore();
    // spiedParse.mockRestore();
  });

  describe('oneWeekBefore', () => {
    it('今の一週間前の日付を出力', () => {
      expect(oneWeekBefore()).toBe('2019-07-25')
    })
  })
  describe('oneWeekLater', () => {
    it('今の一週間後の日付を出力', () => {
      expect(oneWeekLater()).toBe('2019-08-08')
    })
  })
  describe('now', () => {
    it('今の日付を出力', () => {
      expect(now()).toBe('2019-08-01')
    })
  })
})