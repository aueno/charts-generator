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
import { Switch } from "@/components/ui/switch"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

import AOS from 'aos';
import 'aos/dist/aos.css';

import { useAtom } from "jotai";
import { textAreaAtom } from "./input";

export default function ScatterPlot() {

    useEffect(() => {
        AOS.init();
    }, []);

    const [textArea] = useAtom(textAreaAtom);
    const [scatterData, setScatterData] = useState<number[][]>([]);
    const [columnNames, setColumnNames] = useState<string[]>([]);
    const [showTable, setShowTable] = useState(false);

    const [xColumn, setXColumn] = useState(1);
    const [yColumn, setYColumn] = useState(2);

    const [predX, setPredX] = useState(0);
    const [predY, setPredY] = useState(0);

    useEffect(() => {
        const lines = textArea.trim().split("\n");
        if (lines.length === 0) return;

        const firstLine = lines[0].split(/[\s,]+/);
        const isFirstLineNumeric = firstLine.every(val => !isNaN(Number(val)));

        let dataStartIndex = 0;
        if (!isFirstLineNumeric) {
            setColumnNames(firstLine);
            dataStartIndex = 1;
        } else {
            setColumnNames([]);
        }

        const newData = lines.slice(dataStartIndex).map(line => {
            const values = line.split(/[\s,]+/).map(Number);
            return values;
        });

        setScatterData(newData);
    }, [textArea, xColumn, yColumn]);

    const xData = scatterData.map(row => row[xColumn - 1]);
    const yData = scatterData.map(row => row[yColumn - 1]);
    // 最小二乗法
    const n = scatterData.length;
    const sumX = xData.reduce((acc, data) => acc + data, 0);
    const sumY = yData.reduce((acc, data) => acc + data, 0);
    const sumXX = xData.reduce((acc, data) => acc + data * data, 0);
    const sumXY = scatterData.reduce((acc, data) => acc + data[xColumn - 1] * data[yColumn - 1], 0);
    const ta = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const a = Math.round(ta * 1000) / 1000;
    const tb = (sumY - a * sumX) / n;
    const b = Math.round(tb * 1000) / 1000;

    // 決定係数
    const aveX = sumX / n;
    const aveY = sumY / n;
    const aveXY = sumXY / n;
    const stdX = Math.sqrt(xData.reduce((acc, data) => acc + (data - aveX) ** 2, 0) / n);
    const stdY = Math.sqrt(yData.reduce((acc, data) => acc + (data - aveY) ** 2, 0) / n);
    const covXY = aveXY - aveX * aveY;
    const corXY = covXY / (stdX * stdY);
    const rpow2 = Math.round(corXY ** 2 * 1000) / 1000;

    // 線形近似データ
    const xMin = Math.min(...scatterData.map(d => d[xColumn - 1]));
    const xMax = Math.max(...scatterData.map(d => d[xColumn - 1]));
    const linearData = [
        { x: xMin, y: a * xMin + b },
        { x: (xMin + xMax) / 2, y: a * (xMin + xMax) / 2 + b },
        { x: xMax, y: a * xMax + b }
    ];

    const [showPredX, setShowPredX] = useState(false);

    return (
        <div>
            <br />
            <div className="flex items-center space-x-4">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Select onValueChange={(value) => setXColumn(Number(value))}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="列を選択" />
                            </SelectTrigger>
                            <SelectContent>
                                {columnNames.length > 0 ? (
                                    columnNames.map((name, index) => (
                                        <SelectItem key={index} value={(index + 1).toString()}>{name}</SelectItem>
                                    ))
                                ) : (
                                    scatterData[0]?.map((_, index) => (
                                        <SelectItem key={index} value={(index + 1).toString()}>{`列 ${index + 1}`}</SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <p>列（目）を<InlineMath>x</InlineMath>軸とする</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Select onValueChange={(value) => setYColumn(Number(value))}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="列を選択" />
                            </SelectTrigger>
                            <SelectContent>
                                {columnNames.length > 0 ? (
                                    columnNames.map((name, index) => (
                                        <SelectItem key={index} value={(index + 1).toString()}>{name}</SelectItem>
                                    ))
                                ) : (
                                    scatterData[0]?.map((_, index) => (
                                        <SelectItem key={index} value={(index + 1).toString()}>{`列 ${index + 1}`}</SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <p>列（目）を<InlineMath>y</InlineMath>軸とする</p>
                    </div>
                </div>

                <div className="flex items-center">
                    <Button
                        onClick={() => {
                            const temp = xColumn;
                            setXColumn(yColumn);
                            setYColumn(temp);
                        }}
                    >
                        <InlineMath>x</InlineMath>軸と<InlineMath>y</InlineMath>軸を入れ替え
                    </Button>
                </div>
            </div>
            <br />
            <p> &nbsp; </p>
            <div>
                <label>Data Tableの表示</label>
                &nbsp;
                <Switch
                    checked={showTable}
                    onCheckedChange={setShowTable}
                />
            </div>
            <br />
            <p> &nbsp; </p>
            {showTable && (
                <div>
                    <div data-aos="fade-up">
                        <Card>
                            <CardHeader>
                                <CardTitle>Data Table</CardTitle>
                            </CardHeader>
                            <CardContent className="relative">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            {columnNames.map((name, index) => (
                                                <TableHead key={index}>{name || `列${index + 1}`}</TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {scatterData.map((row, rowIndex) => (
                                            <TableRow key={rowIndex}>
                                                {row.map((value, colIndex) => (
                                                    <TableCell key={colIndex}>{value}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                    <br />
                    <p> &nbsp; </p>
                </div>
            )}
            <div data-aos="flip-left">
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
                                        domain={['auto', 'auto']}
                                        name={columnNames[xColumn - 1] ?? `列 ${xColumn}`}
                                        label={{ value: columnNames[xColumn - 1] ?? `列 ${xColumn}`, position: "insideBottom", offset: -10 }}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey="y"
                                        domain={['auto', 'auto']}
                                        name={columnNames[yColumn - 1] ?? `列 ${yColumn}`}
                                        label={{ value: columnNames[yColumn - 1] ?? `列 ${yColumn}`, angle: -90, position: "insideLeft", offset: 10 }}
                                    />
                                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                                    <Scatter
                                        name="Data points"
                                        data={scatterData.map(row => ({ x: row[xColumn - 1], y: row[yColumn - 1] }))}
                                        fill="#8884d8"
                                    />
                                    <Scatter data={linearData} fill="#ff7300" line />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                        <div>
                            <label className="text-2xl">回帰直線</label>
                            <p className="text-2xl">このデータにおける回帰直線式は，<InlineMath>{`y = ${a}x + ${b}`}</InlineMath>&nbsp;です．</p>
                            <br />
                            <label className="text-2xl">決定係数（<InlineMath>R^2</InlineMath>）</label>
                            <p className="text-2xl">上記回帰式の決定係数は，<InlineMath>{`${rpow2}`}</InlineMath>です．</p>
                            <br />
                            <p> &nbsp; </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <br />
            <p> &nbsp; </p>
            <div data-aos="zoom-in">
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
                                onChange={(e) => {
                                    const y = Number(e.target.value);
                                    const x = (y - b) / a;
                                    setPredX(x);
                                    setShowPredX(false);
                                }}
                            />
                            <br />
                            <p className="text-lg">予測された<InlineMath>x</InlineMath>の値：{predX}</p>
                            <p> &nbsp; </p>
                        </div>
                    </CardContent>
                </Card>
                <br />
                <p> &nbsp; </p>
            </div>
        </div>
    );
}
