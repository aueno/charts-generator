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
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

import { useAtom } from "jotai";
import { textAreaAtom } from "./input";

export default function ScatterPlot() {
    const [textArea] = useAtom(textAreaAtom);
    const [scatterData, setScatterData] = useState<number[][]>([]);
    const [columnNames, setColumnNames] = useState<string[]>([]);
    const [showTable, setShowTable] = useState(false);

    const [xColumn, setXColumn] = useState(1);
    const [yColumn, setYColumn] = useState(2);

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

    const aveX = xData.reduce((acc, cur) => acc + cur, 0) / xData.length;
    const aveY = yData.reduce((acc, cur) => acc + cur, 0) / yData.length;
    const aveXY = scatterData.reduce((acc, cur) => acc + cur[xColumn - 1] * cur[yColumn - 1], 0) / scatterData.length;
    const stdX = Math.sqrt(xData.reduce((acc, cur) => acc + (cur - aveX) ** 2, 0) / xData.length);
    const stdY = Math.sqrt(yData.reduce((acc, cur) => acc + (cur - aveY) ** 2, 0) / yData.length);
    const covXY = aveXY - aveX * aveY;
    const corXY = covXY / (stdX * stdY);

    return (
        <>
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
            <div>
                <label>Data Tableの表示</label>
                <Switch
                    checked={showTable}
                    onCheckedChange={setShowTable}
                />
            </div>
            <br />
            {showTable && (
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Table</CardTitle>
                        </CardHeader>
                        <CardContent>
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
            )}
            <br />
            <Card>
                <CardHeader>
                    <CardTitle>グラフ・計算結果出力</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <ScatterChart
                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
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
                                data={scatterData.map(row => ({ x: row[xColumn - 1], y: row[yColumn - 1] }))}
                                fill="#8884d8"
                            />
                        </ScatterChart>
                    </ResponsiveContainer>
                    <div>
                        <label className="text-2xl">相関係数</label>
                        <p className="text-2xl">このデータにおける<b>相関係数は，{Math.round(corXY * 1000) / 1000}</b>です．</p>
                        <br />
                        <p> &nbsp; </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
