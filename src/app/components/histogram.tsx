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

export default function Histogram() {
    const [textArea, setTextArea] = useState("");
    const [inputData, setInputData] = useState<number[]>([]);
    const [kaikyu, setKaikyu] = useState<number>(3);
    const [dosuu, setDosuu] = useState<{ count: number, range: string }[]>([]);
    const [average, setAverage] = useState<number>(0);
    const [median, setMedian] = useState<number>(0);
    const [mode, setMode] = useState<number>(0);
    const [classLimits, setClassLimits] = useState<number[]>([]);
    const [showClassLimitForm, setShowClassLimitForm] = useState(false);

    useEffect(() => {
        const newData = textArea
            .split(/[\s,]+/)
            .filter((data) => data.trim() !== "")
            .map((data) => Number(data));
        setInputData(newData);
    }, [textArea]);

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

    useEffect(() => {
        if (inputData.length === 0) {
            return;
        }
        const max = Math.max(...inputData);
        const min = Math.min(...inputData);
        
        // 階級の幅は自動または手動設定された上限値を使って計算
        const limits = showClassLimitForm ? classLimits : Array.from({ length: kaikyu }, (_, i) => min + (max - min) / kaikyu * (i + 1));
    
        const dosuu = Array.from({ length: kaikyu }, (_, i) => {
            const start = i === 0 ? min : limits[i - 1];
            const end = i === kaikyu - 1 ? max : limits[i];
            const count = inputData.filter((data) => (i === kaikyu - 1 ? (start <= data && data <= end) : (start <= data && data < end))).length;
            return {
                count,
                range: `${start.toFixed(1)}以上${i === kaikyu - 1 ? `${end.toFixed(1)}以下` : `${end.toFixed(1)}未満`}`
            };
        });
        setDosuu(dosuu);
    
        const average = inputData.reduce((acc, cur) => acc + cur, 0) / inputData.length;
        setAverage(average);
    
        const sortedData = inputData.sort((a, b) => a - b);
        const mid = Math.floor(sortedData.length / 2);
        const median = sortedData.length % 2 === 0 ? (sortedData[mid - 1] + sortedData[mid]) / 2 : sortedData[mid];
        setMedian(median);
    
        // 最頻値
        const mode = inputData.reduce((acc, cur) => {
            acc[cur] = (acc[cur] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);
        const maxCount = Math.max(...Object.values(mode));
        const modeData = Object.entries(mode).find(([_, count]) => count === maxCount);
        setMode(Number(modeData?.[0]) || 0);
    }, [inputData, kaikyu, classLimits, showClassLimitForm]);    

    const handleClassLimitChange = (index: number, value: number) => {
        const newLimits = [...classLimits];
        newLimits[index] = value;
        setClassLimits(newLimits);
    };

    // リファレンスライン軸ラベル判定関数
    const getRangeLabel = (value: number) => {
        const range = dosuu.find((data) => {
            const [start, end] = data.range.split("以上");
            if (end.includes("以下")) {
                return Number(start) <= value && value <= Number(end.replace("以下", ""));
            } else {
                return Number(start) <= value && value < Number(end.replace("未満", ""));
            }
        });
        return range ? range.range : 0;
    };

    return (
        <>
            <div className="grid w-full gap-1.5">
                <label>データセット入力</label>
                <Textarea
                    className="w-90"
                    value={textArea}
                    onChange={(e) => setTextArea(String(e.target.value))}
                    rows={5}
                />
                <p className="text-sm text-muted-foreground">
                    数値（データ）を改行またはカンマ区切りで入力してください．
                </p>
                <p className="text-sm">
                    現在,<b>{inputData.length}</b> 個のデータが入力されています．
                </p>
                <br />
            </div>
            <div>
                <label>データインポート（CSV,text[UTF-8]）</label>
                <Input
                    className="w-90"
                    type="file"
                    accept="text/csv,text/plain"
                    onChange={handleFileUpload}
                />
            </div>
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
            <div>
                <label>階級範囲を手動で設定しますか？</label>
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

                    {/* Determine the ranges for average and median */}
                    <ReferenceLine x={getRangeLabel(average)} stroke="" label={<Label value={`平均値: ${average.toFixed(2)}`} position="right" fill="blue" />} />
                    <ReferenceLine x={getRangeLabel(median)} stroke="" label={<Label value={`中央値: ${median}`} position="left" fill="blue" />} />
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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>{Math.max(...inputData)}</TableCell>
                                <TableCell>{Math.min(...inputData)}</TableCell>
                                <TableCell>{average.toFixed(2)}</TableCell>
                                <TableCell>{median}</TableCell>
                                <TableCell>{mode}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}

