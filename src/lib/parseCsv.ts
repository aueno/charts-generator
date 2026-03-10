export type ParseResult = {
  columnNames: string[];
  inputData: number[][];
};

// CSV テキストをパースして列名と数値データを返す
export function parseCsv(text: string): ParseResult {
  const trimmed = text.trim();
  if (!trimmed) return { columnNames: [], inputData: [] };

  const rows = trimmed.split(/\r?\n/);

  // CSVとして分割（空セル保持）
  const splitRow = (row: string) =>
    row.split(",").map((v) => v.trim());

  const firstRowItems = splitRow(rows[0]);

  // ヘッダ判定（1つでも数値でないものがあればヘッダ）
  const hasColumnNames = firstRowItems.some((item) =>
    item !== "" && isNaN(Number(item))
  );

  let columnNames: string[] = [];
  let dataRows: string[][] = [];

  if (hasColumnNames) {
    columnNames = firstRowItems;
    dataRows = rows.slice(1).map(splitRow);
  } else {
    dataRows = rows.map(splitRow);
    const numCols = dataRows[0]?.length || 0;
    columnNames = Array.from({ length: numCols }, (_, i) => `列 ${i + 1}`);
  }

  const numCols = columnNames.length;

  // 数値化（空セルはNaN）
  const inputData: number[][] = dataRows.map((row) => {
    const padded = [...row];

    // 列不足補完
    while (padded.length < numCols) {
      padded.push("");
    }

    return padded.slice(0, numCols).map((cell) => {
      if (cell === "") return NaN;
      const n = Number(cell);
      return isNaN(n) ? NaN : n;
    });
  });

  return { columnNames, inputData };
}