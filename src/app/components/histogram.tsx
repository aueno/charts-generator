"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
    ReferenceLine,
    Label,
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useAtom } from "jotai";
import { textAreaAtom } from "./input";

export default function Histogram() {
    const [textArea] = useAtom(textAreaAtom);
    const [inputData, setInputData] = useState<number[][]>([]);
    const [columnNames, setColumnNames] = useState<string[]>([]);
    const [kaikyu, setKaikyu] = useState<number>(3);
    const [dosuu, setDosuu] = useState<{ count: number, range: string }[]>([]);
    const [average, setAverage] = useState<number>(0);
    const [median, setMedian] = useState<number>(0);
    const [mode, setMode] = useState<number[] | null>(null);
    const [std, setStd] = useState<number>(0);
    const [classLimits, setClassLimits] = useState<number[]>([]);
    const [showClassLimitForm, setShowClassLimitForm] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState<number>(0);

    useEffect(() => {
        const rows = textArea.trim().split('\n');
        const firstRow = rows[0].split(/[,\s]+/);

        const hasColumnNames = firstRow.some(item => isNaN(Number(item)));

        if (hasColumnNames) {
            setColumnNames(firstRow);
            const newData = rows.slice(1).map(row =>
                row.split(/[,\s]+/).map(Number).filter(num => !isNaN(num))
            );
            setInputData(newData);
        } else {
            setColumnNames([]);
            const newData = rows.map(row =>
                row.split(/[,\s]+/).map(Number).filter(num => !isNaN(num))
            );
            setInputData(newData);
        }
    }, [textArea]);

    useEffect(() => {
        if (inputData.length === 0 || selectedColumn < 0 || selectedColumn >= inputData[0].length) {
            return;
        }

        const columnData = inputData.map(row => row[selectedColumn]).filter(num => !isNaN(num));

        const max = Math.max(...columnData);
        const min = Math.min(...columnData);

        const limits = showClassLimitForm ? classLimits : Array.from({ length: kaikyu }, (_, i) => min + (max - min) / kaikyu * (i + 1));

        const dosuu = Array.from({ length: kaikyu }, (_, i) => {
            const start = i === 0 ? min : limits[i - 1];
            const end = i === kaikyu - 1 ? max : limits[i];
            classLimits[i] = end;
            const count = columnData.filter((data) => (i === kaikyu - 1 ? (start <= data && data <= end) : (start <= data && data < end))).length;
            if (typeof start !== "undefined" && typeof end !== "undefined") {
                return {
                    count,
                    range: `${start.toFixed(3)}以上${i === kaikyu - 1 ? `${end.toFixed(3)}以下` : `${end.toFixed(3)}未満`}`
                };
            } else {
                return { count, range: "" };
            }
        });
        setDosuu(dosuu);

        const average = columnData.reduce((acc, cur) => acc + cur, 0) / columnData.length;
        setAverage(average);

        const sortedData = [...columnData].sort((a, b) => a - b);
        const mid = Math.floor(sortedData.length / 2);
        const median = sortedData.length % 2 === 0 ? (sortedData[mid - 1] + sortedData[mid]) / 2 : sortedData[mid];
        setMedian(median);

        const frequencyMap = new Map();
        columnData.forEach(value => {
            frequencyMap.set(value, (frequencyMap.get(value) || 0) + 1);
        });

        let maxFrequency = 0;
        let modeValues: number[] = [];

        frequencyMap.forEach((frequency, value) => {
            if (frequency > maxFrequency) {
                maxFrequency = frequency;
                modeValues = [value];
            } else if (frequency === maxFrequency && frequency > 1) {
                modeValues.push(value);
            }
        });

        if (maxFrequency === 1) {
            setMode(null);
        } else {
            setMode(modeValues.sort((a, b) => a - b));
        }

        const std = Math.sqrt(columnData.reduce((acc, cur) => acc + (cur - average) ** 2, 0) / columnData.length);
        setStd(std);

    }, [inputData, kaikyu, classLimits, showClassLimitForm, selectedColumn]);

    const handleClassLimitChange = (index: number, value: number) => {
        const newLimits = [...classLimits];
        newLimits[index] = value;
        setClassLimits(newLimits);
    };

    const getRangeLabel = (value: number) => {
        const range = dosuu.find((data) => {
            const [start, end] = data.range.split("以上");
            if (typeof end !== "undefined") {
                if (end.includes("以下")) {
                    return Number(start) <= value && value <= Number(end.replace("以下", ""));
                } else {
                    return Number(start) <= value && value < Number(end.replace("未満", ""));
                }
            } else {
                return false;
            }
        });
        return range ? range.range : 0;
    };

    return (
        <>
            <br />
            <div>
                <label>階級数</label>
                <Input
                    className="w-90"
                    type="number"
                    min={1}
                    value={kaikyu}
                    onChange={(e) => setKaikyu(Number(e.target.value))}
                />
            </div>
            <br />
            <label>データ選択</label>
            <div className="flex items-center space-x-2">
                <Select onValueChange={(value) => setSelectedColumn(Number(value))}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="列を選択" />
                    </SelectTrigger>
                    <SelectContent>
                        {columnNames.length > 0 ? (
                            columnNames.map((name, index) => (
                                <SelectItem key={index} value={index.toString()}>{name}</SelectItem>
                            ))
                        ) : (
                            inputData[0]?.map((_, index) => (
                                <SelectItem key={index} value={index.toString()}>{`列 ${index + 1}`}</SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
                &nbsp; について，ヒストグラムを描画する
            </div>
            <br />
            <div>
                <label>階級レンジを手動で設定 &nbsp;</label>
                <Switch
                    checked={showClassLimitForm}
                    onCheckedChange={setShowClassLimitForm}
                />
            </div>
            <br />
            {showClassLimitForm && (
                <div>
                    <label>各階級の上限値</label>
                    {Array.from({ length: kaikyu }, (_, i) => (
                        <Input
                            key={i}
                            className="w-90 mb-2"
                            type="number"
                            value={classLimits[i] || ''}
                            onChange={(e) => handleClassLimitChange(i, Number(e.target.value))}
                            placeholder={`階級${i + 1}の上限`}
                        />
                    ))}
                </div>
            )}
            <br />
            <div>
                <Table>
                    <TableCaption></TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>階級</TableHead>
                            <TableHead>度数</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dosuu.map((data, i) => (
                            <TableRow key={i}>
                                <TableCell>{data.range}</TableCell>
                                <TableCell>{data.count}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <br />
            <div>
                <BarChart width={930} height={350} data={dosuu}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                    <ReferenceLine
                        x={getRangeLabel(average)}
                        stroke=""
                        label={<Label value={`平均値: ${average.toFixed(3)}`} position="right" fill="blue" />}
                    />
                    <ReferenceLine
                        x={getRangeLabel(median)}
                        stroke=""
                        label={<Label value={`中央値: ${median.toFixed(3)}`} position="left" fill="blue" />}
                    />
                </BarChart>
            </div>
            <br />
            <p> &nbsp; </p>
            <Card>
                <CardHeader>
                    <CardTitle>基本統計解析</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                    <Table>
                        <TableCaption></TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>最大値</TableHead>
                                <TableHead>最小値</TableHead>
                                <TableHead>平均値</TableHead>
                                <TableHead>中央値</TableHead>
                                <TableHead>最頻値</TableHead>
                                <TableHead>標準偏差</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>{Math.max(...inputData.map(row => row[selectedColumn])).toFixed(3)}</TableCell>
                                <TableCell>{Math.min(...inputData.map(row => row[selectedColumn])).toFixed(3)}</TableCell>
                                <TableCell>{average.toFixed(3)}</TableCell>
                                <TableCell>{median.toFixed(3)}</TableCell>
                                <TableCell>
                                    {mode !== null
                                        ? mode.map(m => m.toFixed(3)).join(', ')
                                        : 'N/A'}
                                </TableCell>
                                <TableCell>{std.toFixed(3)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}