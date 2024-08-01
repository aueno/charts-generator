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
 } from "recharts";

export default function Histogram() {
    const [textArea, setTextArea] = useState("");
    const [inputData, setInputData] = useState<number[]>([]);
    const [kaikyu, setKaikyu] = useState<number>(3);
    const [dosuu, setDosuu] = useState<{ count: number, range: string }[]>([]);

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
        const range = max - min;
        const width = range / kaikyu;
        const dosuu = Array.from({ length: kaikyu }, (_, i) => {
            const start = min + width * i;
            const end = i === kaikyu - 1 ? max : min + width * (i + 1);
            const count = inputData.filter((data) => i === kaikyu - 1 ? (start <= data && data <= end) : (start <= data && data < end)).length;
            return {
                count,
                range: `${start.toFixed(1)}以上${i === kaikyu - 1 ? `${end.toFixed(1)}以下` : `${end.toFixed(1)}未満`}`
            };
        });
        setDosuu(dosuu);
    }, [inputData, kaikyu]);

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
                </BarChart>
            </div>
        </>
    );
}

