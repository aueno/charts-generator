"use client";

import { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { textAreaAtom } from "./input";

import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip as ChartTooltip, PointElement, LineElement, LineController } from "chart.js";
import { BoxPlotController, BoxAndWiskers } from "@sgratzl/chartjs-chart-boxplot";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

ChartJS.register(CategoryScale, LinearScale, Title, ChartTooltip, BoxPlotController, BoxAndWiskers, PointElement, LineElement, LineController);

export default function BoxplotWithColumnFilter() {
    const [textArea] = useAtom(textAreaAtom);
    const [inputData, setInputData] = useState<number[][]>([]);
    const [columnNames, setColumnNames] = useState<string[]>([]);
    const [boxplotData, setBoxplotData] = useState<
        {
            min: number;
            max: number;
            q1: number;
            q3: number;
            median: number;
            mean: number;
            outliers: number[];
        }[]
    >([]);
    const [visibleColumns, setVisibleColumns] = useState<boolean[]>([]);

    const boxplotChartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<ChartJS | null>(null);

    useEffect(() => {
        if (!textArea.trim()) {
            setInputData([]);
            setColumnNames([]);
            setVisibleColumns([]);
            return;
        }

        const rows = textArea.trim().split("\n");
        const firstRow = rows[0].split(/[,\s]+/);
        const hasColumnNames = firstRow.some((item) => isNaN(Number(item)));

        if (hasColumnNames) {
            setColumnNames(firstRow);
            const newData = rows.slice(1).map((row) =>
                row.split(/[,\s]+/).map(Number).filter((num) => !isNaN(num))
            );
            setInputData(newData);
            setVisibleColumns(new Array(firstRow.length).fill(true));
        } else {
            const newData = rows.map((row) =>
                row.split(/[,\s]+/).map(Number).filter((num) => !isNaN(num))
            );
            setInputData(newData);
            setColumnNames(Array.from({ length: newData[0]?.length || 0 }, (_, i) => `列 ${i + 1}`));
            setVisibleColumns(new Array(newData[0]?.length || 0).fill(true));
        }
    }, [textArea]);

    useEffect(() => {
        if (inputData.length === 0) {
            setBoxplotData([]);
            return;
        }

        const numCols = inputData[0].length;
        const calcPerColumn = [];

        for (let col = 0; col < numCols; col++) {
            const colValues = inputData.map((row) => row[col]).filter((v) => !isNaN(v));
            if (colValues.length === 0) {
                calcPerColumn.push(null);
                continue;
            }

            const sorted = [...colValues].sort((a, b) => a - b);
            const quantile = (arr: number[], q: number) => {
                const pos = (arr.length - 1) * q;
                const base = Math.floor(pos);
                const rest = pos - base;
                if (arr[base + 1] !== undefined) {
                    return arr[base] + rest * (arr[base + 1] - arr[base]);
                } else {
                    return arr[base];
                }
            };

            const q1 = quantile(sorted, 0.25);
            const q3 = quantile(sorted, 0.75);
            const median = quantile(sorted, 0.5);
            const iqr = q3 - q1;
            const lowerFence = q1 - 1.5 * iqr;
            const upperFence = q3 + 1.5 * iqr;

            const nonOutliers = sorted.filter((v) => v >= lowerFence && v <= upperFence);
            const lowerWhisker = nonOutliers.length > 0 ? nonOutliers[0] : sorted[0];
            const upperWhisker = nonOutliers.length > 0 ? nonOutliers[nonOutliers.length - 1] : sorted[sorted.length - 1];

            const mean = sorted.reduce((s, v) => s + v, 0) / sorted.length;

            calcPerColumn.push({
                min: lowerWhisker,
                max: upperWhisker,
                q1,
                q3,
                median,
                mean,
                outliers: sorted.filter((v) => v < lowerFence || v > upperFence),
            });
        }

        setBoxplotData(calcPerColumn.filter((d) => d !== null) as any);
    }, [inputData]);

    useEffect(() => {
        if (boxplotData.length === 0 || !boxplotChartRef.current) return;

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const filteredLabels = columnNames.filter((_, i) => visibleColumns[i]);
        const filteredData = boxplotData.filter((_, i) => visibleColumns[i]);
        const filteredMeans = boxplotData
            .map((d) => d.mean)
            .filter((_, i) => visibleColumns[i]);

        if (filteredData.length === 0) return;

        const ctx = boxplotChartRef.current.getContext("2d");
        if (!ctx) return;

        chartInstanceRef.current = new ChartJS(ctx, {
            type: "boxplot",
            data: {
                labels: filteredLabels,
                datasets: ([
                    {
                        label: "箱ひげ図",
                        backgroundColor: "#cfe4ff",
                        borderColor: "#2b6cb0",
                        borderWidth: 1.5,
                        data: filteredData,
                    },
                    {
                        // mean points: use a line dataset with points only
                        type: "line",
                        label: "平均",
                        data: filteredMeans,
                        borderWidth: 0,
                        showLine: false,
                        pointBackgroundColor: "#ff4d4f",
                        pointBorderColor: "#ff4d4f",
                        pointRadius: 5,
                    },
                ] as any),
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: "箱ひげ図",
                    },
                },
                scales: {
                    y: {
                        beginAtZero: false,
                    },
                },
            },
        });
    }, [boxplotData, columnNames, visibleColumns]);

    const toggleColumnVisibility = (index: number) => {
        const newVisible = [...visibleColumns];
        newVisible[index] = !newVisible[index];
        setVisibleColumns(newVisible);
    };

    return (
        <div className="space-y-4">
            {/* 箱ひげ図 */}
            <div>
                {boxplotData.length > 0 ? (
                    <canvas ref={boxplotChartRef} width={930} height={400}></canvas>
                ) : (
                    <p>箱ひげ図を描画するデータがありません。</p>
                )}
            </div>

            {/* チェックボックス群（グラフ下） */}
            {columnNames.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                    {columnNames.map((name, i) => (
                        <div key={i} className="flex items-center space-x-2">
                            <Checkbox
                                id={`col-${i}`}
                                checked={visibleColumns[i]}
                                onCheckedChange={() => toggleColumnVisibility(i)}
                            />
                            <Label htmlFor={`col-${i}`}>{name}</Label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
