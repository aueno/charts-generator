import { parseCsv } from '@/lib/parseCsv'

describe('parseCsv', () => {
  it('parses Japanese header CSV and numeric values correctly', () => {
    const csv = `国語,地歴公民,数学１,数学２,理科,外国語,情報
165,68,67,75,84,123,78
117,69,81,81,65,115,57
102,52,55,56,93,152,79
160,91,62,68,61,144,98
154,57,67,63,60,167,53
167,57,87,68,59,192,68
197,57,87,84,92,189,74
182,66,81,88,79,106,99
169,97,83,96,79,103,58`

    const { columnNames, inputData } = parseCsv(csv)
    expect(columnNames[0]).toBe('国語')
    expect(columnNames[2]).toBe('数学１')
    expect(inputData.length).toBe(9)
    expect(inputData[0].length).toBe(7)
    // spot check a value
    expect(inputData[0][0]).toBe(165)
  })
})
