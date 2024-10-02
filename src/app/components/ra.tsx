"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
    ScatterChart,
    Scatter,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export default function ScatterPlot() {
    const [textArea, setTextArea] = useState("");
    const [scatterData, setScatterData] = useState<{ x: number; y: number }[]>([]);

    const [xLabel, setXLabel] = useState("X軸");
    const [yLabel, setYLabel] = useState("Y軸");

    const [xColumn, setXColumn] = useState(1);
    const [yColumn, setYColumn] = useState(2);

    const [predX, setPredX] = useState(0);
    const [predY, setPredY] = useState(0);

    useEffect(() => {
        const newData = textArea
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line) => {
                const columns = line.split(/[\s,]+/).map(Number);
                return {
                    x: columns[xColumn - 1],
                    y: columns[yColumn - 1],
                };
            });
        setScatterData(newData);

    }, [textArea, xColumn, yColumn]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result;
            if (!content) return;
            setTextArea(String(content));
        };
        reader.readAsText(file, "UTF-8");
    };

    // 最小二乗法
    const n = scatterData.length;
    const sumX = scatterData.reduce((acc, data) => acc + data.x, 0);
    const sumY = scatterData.reduce((acc, data) => acc + data.y, 0);
    const sumXX = scatterData.reduce((acc, data) => acc + data.x * data.x, 0);
    const sumXY = scatterData.reduce((acc, data) => acc + data.x * data.y, 0);
    const ta = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const a = Math.round(ta * 1000) / 1000;
    const tb = (sumY - a * sumX) / n;
    const b = Math.round(tb * 1000) / 1000;

    // 線形近似データ
    const xMin = Math.min(...scatterData.map(d => d.x));
    const xMax = Math.max(...scatterData.map(d => d.x));
    const linearData = [
        { x: xMin, y: a * xMin + b },
        { x: (xMin + xMax) / 2, y: a * (xMin + xMax) / 2 + b },
        { x: xMax, y: a * xMax + b }
    ];

    return (
        <>
            <div className="grid w-full gap-1.5">
                <label>データセット入力</label>
                <Textarea
                    className="w-90"
                    value={textArea}
                    onChange={(e) => setTextArea(e.target.value)}
                    rows={5}
                />
                <p className="text-sm text-muted-foreground">
                    データを変量間はカンマ区切り，データ間は改行で入力してください．
                </p>
                <p className="text-sm">
                    現在，<b>{scatterData.length}</b> 組のデータが入力されています．
                </p>
                <br />
            </div>
            <div>
                <label>データインポート (CSV,text[UTF-8])</label>
                <Input
                    className="w-90"
                    type="file"
                    accept="text/csv,text/plain"
                    onChange={handleFileUpload}
                />
            </div>
            <br />
            <div>
                <label><InlineMath>x</InlineMath>軸ラベル</label>
                <Input
                    className="w-90"
                    value={xLabel}
                    onChange={(e) => setXLabel(e.target.value)}
                />
                <br />
                <label><InlineMath>y</InlineMath>軸ラベル</label>
                <Input
                    className="w-90"
                    value={yLabel}
                    onChange={(e) => setYLabel(e.target.value)}
                />
            </div>
            <br />
            <div className="flex items-center space-x-4">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Input
                            className="w-20"
                            type="number"
                            min={1}
                            value={xColumn}
                            onChange={(e) => setXColumn(Number(e.target.value))}
                        />
                        <p>列目を<InlineMath>x</InlineMath>軸とする</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Input
                            className="w-20"
                            type="number"
                            min={1}
                            value={yColumn}
                            onChange={(e) => setYColumn(Number(e.target.value))}
                        />
                        <p>列目を<InlineMath>y</InlineMath>軸とする</p>
                    </div>
                </div>

                <div className="flex items-center">
                    <Button
                        onClick={() => {
                            const temp = xColumn;
                            setXColumn(yColumn);
                            setYColumn(temp);
                            const tempLabel = xLabel;
                            setXLabel(yLabel);
                            setYLabel(tempLabel);
                            setScatterData(scatterData.map((d) => ({ x: d.y, y: d.x })));
                        }}
                    >
                        <InlineMath>x</InlineMath>軸と<InlineMath>y</InlineMath>軸を入れ替え
                    </Button>
                </div>
            </div>
            <br />
            <p> &nbsp; </p>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Data Table</CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{xLabel}</TableHead>
                                    <TableHead>{yLabel}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scatterData.map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{data.x}</TableCell>
                                        <TableCell>{data.y}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <br />
            <p> &nbsp; </p>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>グラフ・計算結果出力</CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <div>
                            <ResponsiveContainer width="100%" height={400}>
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid />
                                    <XAxis
                                        type="number"
                                        dataKey="x"
                                        name={xLabel}
                                        label={{ value: xLabel, position: "insideBottom", offset: -10 }}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey="y"
                                        name={yLabel}
                                        label={{ value: yLabel, angle: -90, position: "insideLeft", offset: 10 }}
                                    />
                                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                                    <Scatter name="Data points" data={scatterData} fill="#8884d8" />
                                    <Scatter data={linearData} fill="#ff7300" line/>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                        <div>
                            <label className="text-2xl">線形近似</label>
                            <p className="text-2xl">このデータにおける線形近似式は，<InlineMath>{`y = ${a}x + ${b}`}</InlineMath>&nbsp;です．</p>
                            <br />
                            <p> &nbsp; </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <br />
            <p> &nbsp; </p>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>線形回帰モデルによる値予測</CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        <div>
                            <label className="text-lg"><InlineMath>x</InlineMath>から<InlineMath>y</InlineMath>を予測する</label>
                            <Input
                                className="w-20"
                                type="number"
                                onChange={(e) => {
                                    const x = Number(e.target.value);
                                    const y = a * x + b;
                                    setPredY(y);
                                }}
                            />
                            <br />
                            <p className="text-lg">予測された<InlineMath>y</InlineMath>の値：{predY}</p>
                            <p> &nbsp; </p>
                        </div>
                        <hr />
                        <div>
                            <p> &nbsp; </p>
                            <label className="text-lg"><InlineMath>y</InlineMath>から<InlineMath>x</InlineMath>を予測する</label>
                            <Input
                                className="w-20"
                                type="number"
                                onChange={(e) => {
                                    const y = Number(e.target.value);
                                    const x = (y - b) / a;
                                    setPredX(x);
                                }}
                            />
                            <br />
                            <p className="text-lg">予測された<InlineMath>x</InlineMath>の値：{predX}</p>
                            <p> &nbsp; </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}