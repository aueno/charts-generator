"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
    ScatterChart,
    Scatter,
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


export default function ScatterPlot() {
    const [textArea, setTextArea] = useState("");
    const [scatterData, setScatterData] = useState<{ x: number; y: number }[]>([]);

    const [xLabel, setXLabel] = useState("X軸");
    const [yLabel, setYLabel] = useState("Y軸");

    const [xColumn, setXColumn] = useState(1);
    const [yColumn, setYColumn] = useState(2);

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

    // 統計処理
    const aveX = scatterData.reduce((acc, cur) => acc + cur.x, 0) / scatterData.length;
    const aveY = scatterData.reduce((acc, cur) => acc + cur.y, 0) / scatterData.length;
    const aveXY = scatterData.reduce((acc, cur) => acc + cur.x * cur.y, 0) / scatterData.length;
    const stdX = Math.sqrt(
        scatterData.reduce((acc, cur) => acc + (cur.x - aveX) ** 2, 0) / scatterData.length
    );
    const stdY = Math.sqrt(
        scatterData.reduce((acc, cur) => acc + (cur.y - aveY) ** 2, 0) / scatterData.length
    );
    // 共分散
    const covXY = aveXY - aveX * aveY;
    // 相関係数
    const corXY = covXY / (stdX * stdY);

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
                <label>X軸ラベル</label>
                <Input
                    className="w-90"
                    value={xLabel}
                    onChange={(e) => setXLabel(e.target.value)}
                />
                <br />
                <label>Y軸ラベル</label>
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
                        <p>列目をX軸とする</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Input
                            className="w-20"
                            type="number"
                            min={1}
                            value={yColumn}
                            onChange={(e) => setYColumn(Number(e.target.value))}
                        />
                        <p>列目をY軸とする</p>
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
                        X軸とY軸を入れ替え
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
                                <ScatterChart
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        bottom: 20,
                                        left: 20,
                                    }}
                                >
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
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                        <div>
                            <label>相関係数</label>
                            <p>このデータにおける<b>相関係数は，{Math.round(corXY * 1000) / 1000}</b>です．</p>
                            <br />
                            <p> &nbsp; </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
