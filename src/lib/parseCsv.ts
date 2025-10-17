export type ParseResult = {
  columnNames: string[];
  inputData: number[][];
};

// CSV テキストをパースして、列名と数値データの 2 次元配列を返す
export function parseCsv(text: string): ParseResult {
  const trimmed = text.trim();
  if (!trimmed) return { columnNames: [], inputData: [] };

  const rows = trimmed.split(/\r?\n/);
  const firstRowItems = rows[0].split(/[,\s]+/);
  const hasColumnNames = firstRowItems.some((item) => isNaN(Number(item)));

  if (hasColumnNames) {
    const columnNames = firstRowItems;
    const inputData = rows.slice(1).map((row) => row.split(/[,\s]+/).map((v) => Number(v)).filter((n) => !isNaN(n)));
    return { columnNames, inputData };
  } else {
    const inputData = rows.map((row) => row.split(/[,\s]+/).map((v) => Number(v)).filter((n) => !isNaN(n)));
    const numCols = inputData[0]?.length || 0;
    const columnNames = Array.from({ length: numCols }, (_, i) => `列 ${i + 1}`);
    return { columnNames, inputData };
  }
}
